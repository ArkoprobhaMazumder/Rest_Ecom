import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: {
        type: String, require: true, unique: true,
        match: [/.+\@.+\../, "Please give a valid email"]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must 8 characters and have a special character",
        }
    },
    type: { type: String, enum: ['seller', 'customer', 'admin'] }
})

export default userSchema;