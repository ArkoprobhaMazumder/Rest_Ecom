import { body, validationResult } from "express-validator";


export default async function registerValidation(req, res, next) {

    let rules = [
        body('name').notEmpty().withMessage("Name is required"),
        body('name').isLength({ min: 2, max: 20 }).withMessage("Name should be 2 to 20 character's"),
        body('email').isEmail().withMessage("Give a valid email"),
        body('password').isLength({ min: 6 }).withMessage("Password must has 6 characters"),
        body('type').notEmpty().withMessage("Unmatched user type")
    ]

    await Promise.all(rules.map(rule => rule.run(req)));

    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).send({ error: validationErrors.array()[0].msg });
    }

    next();
}