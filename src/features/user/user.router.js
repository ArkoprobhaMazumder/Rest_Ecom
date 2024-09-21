import express from "express";
import UserController from "./user.controller.js";
import registerValidation from "../../middleware/signup.middleware.js";
import jwtTokenVerification from "../../middleware/jwtVarification.middleware.js";

//  configure userRouter
const userRouter = express.Router();

// configure userController
const userController = new UserController();


// Configure the user routes
userRouter.get('/login', (req, res) => {
    userController.userSignIn(req, res);
});
userRouter.post('/signup', registerValidation, (req, res, next) => {
    userController.userSignUp(req, res, next);
});
userRouter.put("/reset-password", jwtTokenVerification, (req, res) => {
    userController.resetPassword(req, res);
})



export default userRouter;