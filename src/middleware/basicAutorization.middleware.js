import UserModel from "../features/user/user.model.js";


export default function basicAuthorization(req, res, next) {

    // 1. check for the credential
    let authHead = req.headers['authorization'];

    // 2. Not get the credential
    if (!authHead) return res.status(401).send("Unauthorized Request");

    // 3. Available credentials in base64(encoded) format
    let base64Credential = authHead.replace("Basic ", "");

    // 4. Decode the base64 credential
    let decodedCredential = Buffer.from(base64Credential, 'base64').toString('utf-8');

    let cred = decodedCredential.split(":");

    // 5. matching the credential from user List
    let user = UserModel.allUsers().find(u => u.email == cred[0] && u.password == cred[1]);

    if (!user) return res.status(401).send("Invalid Credential");

    next();

}