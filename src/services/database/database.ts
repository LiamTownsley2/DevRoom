import * as mongoDB from "mongodb";
import keys from "../../keys";

export const collections: { guild_config?: mongoDB.Collection, scheduled_messages?: mongoDB.Collection } = {}

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(keys.DB_CONN_STRING);
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    const guildConfigCollection: mongoDB.Collection = db.collection('guild_config');
    const scheduledMessagesCollection: mongoDB.Collection = db.collection('scheduled_messages');

    collections.guild_config = guildConfigCollection;
    collections.scheduled_messages = scheduledMessagesCollection;

    console.log(`[database.service]`, `Successfully connected to database: ${db.databaseName}`);
}