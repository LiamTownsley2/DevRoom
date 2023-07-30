import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface ScheduledMessage {
    guild_id: Snowflake;
    channel_id: Snowflake;
    author_id: Snowflake;
    author_username: string;
    author_avatar: string;
    message: string;
    delay: TimeOfDay | CustomDelay;
    last_sent: Date | null;
    created_at: Date;
    _id?: ObjectId;
}

export interface TimeOfDay {
    type: 'time';
    hour: number;
    minute: number;
}

export interface CustomDelay {
    type: 'custom';
    seconds: Number;
}