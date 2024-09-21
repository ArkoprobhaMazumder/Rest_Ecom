import jwt from "jsonwebtoken";


export default function jwtTokenVerification(req, res, next) {

    // 1. check the exist token
    let token = req.headers['authorization'];

    //2. if no token send error
    if (!token) res.status(401).send("Unauthorized Access");

    //3. verify the token and get the req payload
    try {
        let payload = jwt.verify(token, "WQUEB4RdLqN3nUzZXlDsvElYJrHSscWJ");
        req.userId = payload.userId;
    } catch (error) {
        //4. for failed verification
        res.status(401).send("invalid credentials");
    }

    //5. go to the next handler
    next();


}