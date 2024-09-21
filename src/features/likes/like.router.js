
import LikeController from "./like.controller.js";
import express from "express";

const likeRouter = express.Router();

// Like controller instance
const likeController = new LikeController();


likeRouter.post('/', (req, res, next) => {
    likeController.addLike(req, res, next);
})
likeRouter.get('/', (req, res, next) => {
    likeController.getLikes(req, res, next);
})


export default likeRouter;