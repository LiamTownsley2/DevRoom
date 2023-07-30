import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface ScheduledMessage {
    guild_id: Snowflake;
    channel_id: Snowflake;
    message: string;
    delay: TimeOfDay | CustomDelay;
    last_sent: Date | null;
    _id?: ObjectId;
}

export interface TimeOfDay {
    type: 'time';
    hour: number;
    minute: number;
}

export interface CustomDelay {
    type: 'custom';
    seconds: number;
}