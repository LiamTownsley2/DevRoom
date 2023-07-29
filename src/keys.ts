import { Keys } from "./types";

const keys: Keys = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN ?? 'nd',
    CLIENT_ID: process.env.CLIENT_ID ?? 'nd',
    GUILD_ID: process.env.GUILD_ID ?? 'nd',
    DB_CONN_STRING: process.env.DB_CONN_STRING ?? 'nd',
    DB_NAME: process.env.DB_NAME ?? 'nd',
    CONFIG_COLLECTION_NAME: process.env.CONFIG_COLLECTION_NAME ?? 'nd',
}

for (const [k, v] of Object.entries(keys)) {
    if(v as string == 'nd') {
        throw new Error(`[Environment Variable Error] Missing data within Environment Variable ${k}.`);        
    }
}

export default keys