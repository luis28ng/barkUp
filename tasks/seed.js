import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import parks from "../data/parks.js";
import stores from "../data/petStores.js";
import reviews from "../data/reviews.js";
import { registerUser, loginUser } from "../data/users.js";

const db = await dbConnection();

await closeConnection();
