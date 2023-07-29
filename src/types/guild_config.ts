import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface GuildConfig {
    guild_id: Snowflake;
    welcome_module: {
        enabled: boolean;
        discord_mode: boolean; // If true then send welcome messages like "X joined the party" or "Welcome X. Say hi!"
        custom_welcome_message: string | null; // If discord_mode is false this will be used.
    };
    automessage_module: {
        enabled: boolean;
        server_messages: AutoMessage[]
    };
    messagetracker_module: {
        enabled: boolean;
    };
    games_module: {
        enabled: boolean;
    }
    _id?: ObjectId;
}

export interface AutoMessage {
    guild_id: Snowflake;
    channel_id: Snowflake;
    message: string;
    frequency: number;
}