import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: Array,
    inStock: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ]
})