// All the imports of entry page

// configure .env at the top
import "./env.js";

// Third party npm modules
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import swagger from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";

// Internal module
import productRouter from "./src/features/product/product.router.js";
import userRouter from "./src/features/user/user.router.js";
import jwtTokenVerification from "./src/middleware/jwtVarification.middleware.js";
import cartRouter from "./src/features/cart/cart.router.js";
import apiDocs from "./swagger.json" assert {type: "json"};
import logMidddleware from "./src/middleware/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import orderRouter from "./src/features/order/order.router.js";
import likeRouter from "./src/features/likes/like.router.js";

// create server
const server = express();

// CORS policy
server.use(cors());

// server.use((req, res, next) => {

//     res.header("Access-control-allow-origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Access-Control-Allow-Methods", "*");

//     // return ok for preflight requests
//     if (req.method == "OPTIONS") {
//         res.sendStatus(200);
//     }
//     next();
// })


// Parsing the incoming request body contents
server.use(bodyParser.json());

// Parsing cookie
server.use(cookieParser());

// impliment logger middleware in application lavel
server.use(logMidddleware);

// Routes for our api features
server.use('/api/product', productRouter);
server.use('/api/user', userRouter);
server.use('/api/cart', jwtTokenVerification, cartRouter);
server.use('/api/order', jwtTokenVerification, orderRouter);
server.use('/api/likes', jwtTokenVerification, likeRouter);
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));


// Default Api
server.get('/', (req, res) => {
    res.send("Welcome to ecommerce api");
})

server.use((err, req, res, next) => {

    // Validation error
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(err.message);
    }

    // Application Errors
    if (err instanceof ApplicationError) {
        return res.status(err.code).send(err.message);
    }
    // Server Errors
    return res.status(500).send("Something went wrong, Please try after sometime")
})

// Handle for unmatched request
server.use((req, res) => {
    res.status(404).send("Api not found");
})

export default server;