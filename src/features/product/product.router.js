import express from "express";
import Productcontroller from "./product.controllers.js";
import { imageUpload } from "../../middleware/fileUpload.middleware.js";
import jwtTokenVerification from "../../middleware/jwtVarification.middleware.js";

// configure productRouter
const productRouter = express.Router();

// Configure productcontroller
const productController = new Productcontroller();

// Define Productcontroller Route 
productRouter.get('/', (req, res) => {
    productController.getProducts(req, res);
});

productRouter.post('/add-product', imageUpload.single('image'), jwtTokenVerification, (req, res) => {
    productController.addProduct(req, res);
});

productRouter.get("/filter", jwtTokenVerification, (req, res) => {
    productController.filterProducts(req, res);
});

productRouter.get('/avarage', jwtTokenVerification, (req, res, next) => {
    productController.avarage(req, res, next);
})

productRouter.get("/:id", (req, res) => {
    productController.getOneProduct(req, res);
});

productRouter.post('/rate', jwtTokenVerification, (req, res, next) => {
    productController.rateProduct(req, res, next);
});



// Export the default productRouter
export default productRouter;