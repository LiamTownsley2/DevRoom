import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface UserStats {
    guild_id: Snowflake;
    user_id: Snowflake;
    messages: number;
    _id?: ObjectId;
}