import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartRepository {

    constructor() {
        this.collection = "cartItems";
    }

    async addCartItem(productId, userId, quantity) {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            // const id = await this.getNextCounter(db);

            // 1. check for the product with prev user
            // 2. if available then change else insert new data 
            // 3. with one instruction
            await collection.updateOne(
                { productId: new ObjectId(productId), userId: new ObjectId(userId) },
                {
                    // $setOnInsert: { _id: id },
                    $inc: { quantity: parseInt(quantity) }
                },
                { upsert: true }
            )
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }

    async getCartItems(id) {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            return await collection.find({ userId: new ObjectId(id) }).toArray();

        } catch (error) {
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }

    async deleteCartItem(cartItemId, userId) {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            let result = await collection.deleteOne({ _id: new ObjectId(cartItemId), userId: new ObjectId(userId) });
            return result.deletedCount > 0
        } catch (error) {
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }

    // async getNextCounter(db) {

    //     const counter = await db.collection('counters').findOneAndUpdate(
    //         { _id: 'cartItemId' },
    //         { $inc: { value: 1 } },
    //         { returnDocument: 'after' }
    //     )
    //     console.log(counter.value);
    //     return counter.value;
    // }

}