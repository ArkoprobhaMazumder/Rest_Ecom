import { LikeModel } from "./like.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";


export default class LikeRepository {

    async likes(id, types) {
        try {
            return await LikeModel.find({
                likeable: new ObjectId(id),
                types: types,
            }).populate('user').populate({ path: "likeable", model: types });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something Went wrong in Database", 400);
        }
    }

    async likeProduct(userId, productId) {
        try {
            const newLike = LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                types: "Product"
            })
            await newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something Went wrong in Database", 400);
        }
    }

    async likeCategory(userId, categoryId) {
        try {
            const newLike = LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: "Category"
            })
            await newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something Went wrong in Database", 400);
        }
    }
}