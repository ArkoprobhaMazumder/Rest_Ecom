

import mongoose from "mongoose";


const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "types"
    },
    types: {
        type: String,
        enum: ['Product', "Category"]
    }
}).pre('save', (next) => {
    console.log("Like is going to add");
    next();
}).post('save', (docs) => {
    console.log("Like is added ");
    console.log(docs);
}).pre('find', (next) => {
    console.log("Retriving Data");
    next();
}).post('find', (docs) => {
    console.log(docs)
})

export const LikeModel = mongoose.model("Like", likeSchema);