import { ObjectId } from "mongodb";
import { getClient, getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository {

    constructor() {
        this.collection = "orders";
    }

    async placeUserOrder(userId) {

        try {

            // const client = getClient();
            // const session = client.startSession();
            // session.startTransaction();

            const db = getDb();

            // 1. Get cartItems and calculate total amount
            let items = await this.getTotalAmount(userId);
            let finalTotalAmount = items.reduce((accum, curEle) => {
                return accum + curEle.totalAmount;
            }, 0);
            console.log(finalTotalAmount);

            // 2. create a record for order
            let newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder,);

            // 3.reduce stock (product quantity)
            for (let item of items) {
                await db.collection("products").updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } }
                )
            }

            // 4. clear cart
            await db.collection('cartItems').deleteMany(
                { userId: new ObjectId(userId) }
            )

            return;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in database", 500);
        }
    }

    async getTotalAmount(userId) {
        try {
            const db = getDb();
            const items = await db.collection("cartItems").aggregate([
                // stage1. get the cart items for the user
                {
                    $match: { userId: new ObjectId(userId) }
                },
                // stage2: get products for the user from product collection
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productInfo',
                    }
                },
                // stage3: unwind(make an array) of the result from productInfo
                {
                    $unwind: "$productInfo"
                },
                // stage4: get totalAmount for each cartItems
                {
                    $addFields: {
                        'totalAmount': {
                            $multiply: ["$productInfo.price", "$quantity"]
                        }
                    }
                }
            ]).toArray();
            return items;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }
}