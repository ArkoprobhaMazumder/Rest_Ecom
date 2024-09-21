import { ObjectId } from "mongodb";
import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./catagory.schema.js";

const productModel = mongoose.model('Product', productSchema);
const reviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

export default class ProductRepository {

    constructor() {
        this.collection = "products"
    }

    async add(product) {
        try {
            console.log(product);
            //   1.Add new product
            product.categories = product.category.split(',').map(e => e.trim());
            const newProduct = new productModel(product);
            const newAddedProduct = await newProduct.save();
            console.log(newAddedProduct);

            // 2. add categories to the product
            await CategoryModel.updateMany(

                { _id: { $in: product.categories } },
                { $push: { products: new ObjectId(newAddedProduct._id) } }

            )

        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    async getAll() {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            return await collection.find().project({ _id: 0, name: 1, price: 1, ratings: { $slice: 2 } }).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    async getOne(id) {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            return await collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    async filter(minPrice, maxPrice, catagory) {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if (minPrice) {
                filterExpression.price = { $gte: parseFloat(minPrice) };
            }
            if (maxPrice) {
                filterExpression.price = { ...filterExpression.price, $lte: parseFloat(maxPrice) };
            }
            if (catagory) {
                filterExpression.catagory = catagory;
            }
            return await collection.find(filterExpression).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    async rating(userId, productId, rating) {
        // try {
        // const db = getDb();
        // const collection = db.collection(this.collection);

        // 1.Find The product
        // let product = await collection.findOne({ _id: new ObjectId(productId) });

        // // 2.Find the userRating from that product
        // let userRating = product?.ratings?.find(r => r.userId == userId);

        // if (userRating) {
        //     // 3.update the rating
        //     await collection.updateOne({
        //         _id: new ObjectId(productId), "ratings.userId": new ObjectId(userId)
        //     }, {
        //         $set: {
        //             "ratings.$.rating": rating
        //         }
        //     })
        // } 
        // else {
        //     return await collection.updateOne({ _id: new ObjectId(productId) }, {
        //         $push: { ratings: { userId: new ObjectId(userId), rating } }
        //     })
        // }

        // Another way
        // 1. Removes an existing entry
        // await productModel.updateOne({ _id: new ObjectId(productId) }, { $pull: { ratings: { userId: new ObjectId(userId) } } });

        // // 2. Add new Entry
        // return await productModel.updateOne({ _id: new ObjectId(productId) }, {
        //     $push: { ratings: { userId: new ObjectId(userId), rating } }
        // })

        try {
            // 1. check if product exists
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Product not found')
            }

            // 2. get the exsisting review
            const reviewProduct = await reviewModel.findOne({ product: new ObjectId(productId), user: new ObjectId(userId) });
            if (reviewProduct) {
                reviewProduct.rating = rating;

                await reviewProduct.save();
            } else {
                let newReview = {
                    product: new ObjectId(productId),
                    user: new ObjectId(userId),
                    rating: rating
                }
                let newRating = new reviewModel(newReview);

                await newRating.save();
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    async getAvarage() {
        try {
            const db = getDb();
            const collection = db.collection(this.collection);
            return await collection.aggregate(
                [
                    {
                        // Stage 1
                        $group: {
                            _id: "$catagory",
                            avaragePrice: { $avg: '$price' }
                        }
                    }
                ]
            ).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 400);
        }
    }

    // async getCounter(db) {

    //     let counter = await db.collection('counters').findOneAndUpdate(
    //         { _id: 'productCounter' },
    //         { $inc: { value: 1 } },
    //         { returnDocument: 'after' }
    //     )

    //     return counter.value;
    // }
}