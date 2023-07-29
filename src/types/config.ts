import { ActivityType, PresenceStatusData } from "discord.js";
import { ObjectId } from "mongodb";

export interface IConfig {
    guild_id: string;
    status: {
        message: string;
        status: PresenceStatusData;
        type?: ActivityType;
    }
    logging: {
        bot_logs: string | null;
    },
    _id?: ObjectId;
}