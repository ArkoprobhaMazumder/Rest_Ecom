import mongoose from "mongoose";
import { categorySchema } from "../features/product/catagory.schema.js";
const Url = process.env.DB_URL;

export const mongooseConnection = async () => {
    try {
        await mongoose.connect(Url);
        await addCategories();
        console.log("Mongodb With Mongoose Connected");
    } catch (error) {
        console.log(error.message);
    }
}

async function addCategories() {
    try {
        const CategoryModel = mongoose.model("Category", categorySchema);
        const category = await CategoryModel.find();
        if (!category || category.length == 0) {
            await CategoryModel.insertMany([{ name: "Books" }, { name: "Clothing" }, { name: "Electronics" }]);
        }

    } catch (error) {
        console.log(error);
    }
}