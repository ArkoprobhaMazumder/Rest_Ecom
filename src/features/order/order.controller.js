import OrderRepository from "./order.repository.js";


export default class OrderController {

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req, res, next) {
        try {
            let userId = req.userId;
            await this.orderRepository.placeUserOrder(userId);
            res.status(200).send("Order Created");
        } catch (error) {
            console.log(error);
            res.status(400).send("Order Failed");
        }
    }
}