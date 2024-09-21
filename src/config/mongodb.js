

import { MongoClient } from "mongodb";

const URL = process.env.DB_URL;

let client;
export const connectMongodb = () => {
    MongoClient.connect(URL).then(clientInstance => {
        client = clientInstance;
        console.log("Database Connected");
        createIndexes(client.db());
    }).catch(err => {
        console.log(err);
    })
}

export const getClient = () => {
    return client;
}

export const getDb = () => {
    return client.db();
}


const createIndexes = async (db) => {
    try {
        await db.collection('products').createIndex({ price: 1 });
        await db.collection("products").createIndex({ name: 1, catagory: -1 });
        await db.collection('products').createIndex({ description: 'text' });
        console.log("Index created");
    } catch (error) {
        console.log(error);
    }
}