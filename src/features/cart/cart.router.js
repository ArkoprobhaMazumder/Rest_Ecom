import express from "express";
import CartController from "./cart.controller.js";
import cartValidation from "../../middleware/cartValidation.middleware.js"


// configure cart Router
const cartRouter = express.Router();

// cond=figure cart controller
const cartController = new CartController();

cartRouter.post('/', cartValidation, (req, res) => {
    cartController.addToCart(req, res);
});
cartRouter.get('/', (req, res) => {
    cartController.allCartItems(req, res);
});
cartRouter.delete('/delete-cart', (req, res) => {
    cartController.deleteCartProuct(req, res);
});

export default cartRouter;