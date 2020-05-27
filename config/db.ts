import { MongoClient } from "../dependencies.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

const db = client.database("denoapi");

export default db;
