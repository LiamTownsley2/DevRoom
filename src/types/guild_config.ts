import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface GuildConfig {
    guild_id: Snowflake;
    welcome_module: {
        enabled: boolean;
        discord_mode: boolean; // If true then send welcome messages like "X joined the party" or "Welcome X. Say hi!"
        custom_welcome_message: string | null; // If discord_mode is false this will be used.
        welcome_channel: Snowflake | null;
    };
    scheduled_messages_module: {
        enabled: boolean;
    };
    message_tracker_module: {
        enabled: boolean;
    };
    games_module: {
        enabled: boolean;
    }
    _id?: ObjectId;
}