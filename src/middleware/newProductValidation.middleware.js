import { body, validationResult } from "express-validator";


export default async function productValidation(req, res, next) {

    // 1. Set up the validation rules
    let rules = [
        body('name').notEmpty().withMessage("Name is Required"),
        body('name').isLength({ min: 3, max: 20 }).withMessage("Name should atleast 4 characters and max 20 characters"),
        body('price').isFloat({ gt: 0 }).withMessage("Price should be a positive value"),
        body('description').notEmpty().withMessage("Description atleast 10 character to 30"),
        body('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image is required");
            }
            return true;
        }),
    ]

    // 2. Execute the rules
    await Promise.all(rules.map((rule) => rule.run(req)));

    // 3. Check any error after running the rules
    let validationErrors = validationResult(req);

    // 4. Execute the error message if occurs
    if (!validationErrors.isEmpty()) {
        return res.send({ error: validationErrors.array() });
    }
    next();
}