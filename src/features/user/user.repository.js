import { ApplicationError } from "../../error-handler/applicationError.js";
import userSchema from "./user.schema.js";
import mongoose from "mongoose";

const UserModel = mongoose.model("User", userSchema);

export default class Userrepository {

    async signUp(user) {
        try {
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            } else {
                throw new ApplicationError("Something went wrong in database", 500);
            }
        }
    }

    async signIn(email, password) {
        try {
            await UserModel.findOne({ email: email, password: password });

        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }

    async changePassword(userId, password) {
        try {
            let user = await UserModel.findById(userId);
            console.log(user);
            if (user) {
                user.password = password;
                await user.save();
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong in database", 500);
        }
    }
}