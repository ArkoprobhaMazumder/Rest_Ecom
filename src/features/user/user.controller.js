import jwt from "jsonwebtoken";
import { ApplicationError } from "../../error-handler/applicationError.js";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";


export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async userSignUp(req, res, next) {
        let { name, email, password, type } = req.body;
        try {
            let user = await this.userRepository.findByEmail(email);
            if (user) return res.status(400).send("Already a User");

            // Hashing password
            const hashedPassword = await bcrypt.hash(password, 12);
            let newUser = { name: name, email: email, password: hashedPassword, type: type };
            await this.userRepository.signUp(newUser);
            return res.status(201).send("Sign up Successfull !!!!");
        } catch (err) {
            next(err);
        }
    }

    async userSignIn(req, res) {

        try {
            let user = await this.userRepository.findByEmail(req.body.email);

            if (!user) return res.status(400).send("Invalid Credentials");
            else {
                let result = await bcrypt.compare(req.body.password, user.password);
                if (result) {
                    let token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    })

                    return res.status(200).cookie("userToken", token, {
                        maxAge: 60 * 60 * 1000
                    }).send({ msg: "Login Successfull", cookie: token });
                }
                else {
                    return res.status(401).send("Invalid Credentials");
                }
            }

        } catch (error) {
            console.log(error);
            res.status(505).send("Something wrong");
        }
    }

    async resetPassword(req, res) {
        try {
            let { newPassword } = req.body;
            const userId = req.userId;

            const updatedPassword = await bcrypt.hash(newPassword, 12);
            await this.userRepository.changePassword(userId, updatedPassword);
            return res.status(201).send("Password is Changed");
        } catch (error) {
            console.log(error);
            return res.status(400).send("Password not changed");
        }
    }
}