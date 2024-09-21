
import CartRepository from "./cart.repository.js";



export default class CartController {

    constructor() {
        this.cartRepository = new CartRepository();
    }

    async allCartItems(req, res) {
        try {
            let id = req.userId;

            let userCartItems = await this.cartRepository.getCartItems(id);
            return res.status(200).send(userCartItems);
        } catch (error) {
            return res.status(400).send("Error in cart");
        }
    }

    async addToCart(req, res) {
        try {
            let productId = req.query.productId;
            let quantity = req.query.quantity;
            let userId = req.userId;

            await this.cartRepository.addCartItem(productId, userId, quantity);
            return res.status(201).send("Cart Added");
        } catch (error) {
            res.status(400).send("Error in adding to cart");
        }
    }

    async deleteCartProuct(req, res) {
        try {
            let cartItem = req.query.id;
            let userId = req.userId;

            let result = await this.cartRepository.deleteCartItem(cartItem, userId);
            if (!result) return res.status(400).send("Not deleted");
            return res.status(200).send("Successfully deleted");
        } catch (error) {
            return res.status(400).send("Error in adeleting cart item");
        }
    }
}