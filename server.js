import server from "./index.js";
// import { connectMongodb } from "./src/config/mongodb.js";
import { mongooseConnection } from "./src/config/mongoose.config.js";


// Start The server
server.listen(3200, () => {
    // connectMongodb();   mongodb connection function
    mongooseConnection();
    console.log(`Server is running https://localhost:3200`);
})