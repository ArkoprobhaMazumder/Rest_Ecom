import LikeRepository from "./like.repository.js";

export default class LikeController {

    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async addLike(req, res, next) {
        try {
            let { id, type } = req.body;
            const userId = req.userId;

            if (type != 'Product' && type != 'Category') {
                return res.status(404).send('Invalid Type');
            }
            if (type == 'Product') {
                await this.likeRepository.likeProduct(userId, id);
            } else {
                await this.likeRepository.likeCategory(userId, id);
            }
            return res.status(201).send(`Liked ${type}`);
        } catch (error) {
            next(error);
        }
    }

    async getLikes(req, res, next) {
        try {
            let { id, types } = req.query;
            let like = await this.likeRepository.likes(id, types);
            res.status(200).send(like);
        } catch (error) {
            next(error);
        }
    }
}