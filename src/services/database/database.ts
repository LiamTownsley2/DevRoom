import * as mongoDB from "mongodb";
import keys from "../../keys";

export const collections: { config?: mongoDB.Collection, giveaway?: mongoDB.Collection, mutes?: mongoDB.Collection } = {}

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(keys.DB_CONN_STRING);
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    const configCollection: mongoDB.Collection = db.collection('config');

    collections.config = configCollection;

    console.log(`[database.service]`, `Successfully connected to database: ${db.databaseName}`);
}