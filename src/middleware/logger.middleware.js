
import fs from "fs";
import winston from "winston";

// const fsPromises = fs.promises;

// async function log(logData) {

//     try {
//         logData = `${new Date().toString()} - ${logData}\n`;
//         await fsPromises.appendFile('log.txt', logData);
//     } catch (error) {
//         console.log(error);
//     }
// }

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: "log.txt" })
    ]
})

const logMidddleware = async (req, res, next) => {
    try {
        if (!req.url.includes('/login' || "/signup")) {
            let logData = `${req.url} -> ${JSON.stringify(req.body)}`;
            logger.info(logData);
        }
        next();
    } catch (error) {
        console.log(error);
    }

}

export default logMidddleware;