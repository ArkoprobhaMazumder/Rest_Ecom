import { getDb } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import userSchema from "./user.schema.js";
import mongoose from "mongoose";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {

    async signUp(newUser) {
        try {
            // 1. create an instance of database
            const db = getDb();
            // // 2. create a collection
            const collection = db.collection('users');
            // // 3. insert data to collection
            await collection.insertOne(newUser);

            // const user = new UserModel(newUser);
            // await user.save();
        } catch (error) {
            throw new ApplicationError("Something went wrong with database", 503);
        }
    }

    async singIn(email, password) {
        try {
            const db = getDb();
            const collection = db.collection('users');
            return await collection.findOne({ email, password });
        } catch (error) {
            throw new ApplicationError("Something went wrong in database");
        }
    }

    async findByEmail(email) {
        try {
            const db = getDb();
            const collection = db.collection('users');
            return await collection.findOne({ email });
        } catch (error) {
            throw new ApplicationError("Something went wrong", 400);
        }
    }
}