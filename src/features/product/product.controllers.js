import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";


export default class Productcontroller {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getProducts(req, res) {
        try {
            let products = await this.productRepository.getAll();
            return res.status(200).send(products);
        } catch (error) {
            console.log(error);
            return res.status(400).send("Error in getting all products", 400);
        }
    }

    async addProduct(req, res) {
        let { name, description, price, category, sizes } = req.body;
        try {
            let newProduct = new ProductModel(name, description, parseFloat(price), req?.file?.filename, category, sizes?.split(","))
            await this.productRepository.add(newProduct);
            return res.status(201).send("Product Added");
        } catch (error) {
            console.log(error);
            return res.status(400).send("Product not added");
        }
    }

    async getOneProduct(req, res) {
        let id = req.params.id;
        try {
            let singleProduct = await this.productRepository.getOne(id);
            if (!singleProduct) return res.status(400).send("No Products found");
            return res.status(200).send(singleProduct);
        } catch (error) {
            console.log(error);
            return res.status(400).send("Error in finding product");
        }
    }

    async filterProducts(req, res) {
        try {
            let min = req.query.minprice;
            let max = req.query.maxprice;
            let catagory = req.query.catagory;

            let filteredProducts = await this.productRepository.filter(min, max, catagory);
            if (filteredProducts.length < 1) return res.status(400).send('No Filtered products');
            res.status(200).send(filteredProducts);

        } catch (error) {
            console.log(error);
            return res.status(400).send("Error in filtering product")
        }
    }

    async rateProduct(req, res, next) {
        try {
            let userId = req.userId;
            let productId = req.body.productId;
            let rating = req.body.rating;

            await this.productRepository.rating(userId, productId, rating);
            res.status(200).send("Rating Added");
        } catch (error) {
            next(error);
        }
    }

    async avarage(req, res, next) {
        try {
            let result = await this.productRepository.getAvarage();
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }
}