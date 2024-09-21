import { query, validationResult } from "express-validator";


export default async function cartValidation(req, res, next) {


    const rules = [
        query("productId").notEmpty().withMessage("Not a valid product"),
        query("quantity").notEmpty().withMessage("No product to add"),
        query('quantity').custom((value, { req }) => {
            if (req.query.quantity <= 0) throw new Error("Atleast one product require");
            return true;
        })
    ]

    await Promise.all(rules.map(rule => rule.run(req)));

    const validationError = validationResult(req);
    if (!validationError.isEmpty()) return res.send({ error: validationError.array()[0].msg });
    next();
}