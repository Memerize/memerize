import { MongoClient } from "mongodb";

const uri = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(uri);
export const db = client.db("memerize");
