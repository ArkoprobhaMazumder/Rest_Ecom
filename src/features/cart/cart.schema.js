import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
    quantity: Number
})

export default cartSchema;