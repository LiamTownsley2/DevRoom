import { collections } from "..";
import { GuildConfig } from "../../types";
import CustomCache from "../../utils/custom_cache";

export const GUILD_CONFIG_EXPIRATION = 5; // in minutes
export const guild_config_cache = new CustomCache<GuildConfig>()

export async function getGuildConfig(guild_id: string): Promise<GuildConfig> {
    let config;
    if (guild_config_cache.get(guild_id)) {
        config = guild_config_cache.get(guild_id)?.value
        if (config) {
            return config;
        }
    }

    config = await getGuildConfigFromDatabase(guild_id);

    if (config == undefined) {
        config = _getDefaultGuildConfig(guild_id);
        await insertGuildConfigToDatabase(config);
    }

    guild_config_cache.set(guild_id, {
        value: config,
        expiration: new Date(Date.now() + GUILD_CONFIG_EXPIRATION * 60000)
    })

    return config;
}

export async function getGuildConfigFromDatabase(guild_id: string): Promise<GuildConfig> {
    try {
        let res = await collections.guild_config?.findOne({ guild_id }, {});
        if (!res) {
            res = _getDefaultGuildConfig(guild_id);
        }
        return res as GuildConfig;
    } catch (err) {
        console.log('[database] ', err);
        return _getDefaultGuildConfig(guild_id);
    }
}

export async function insertGuildConfigToDatabase(config: GuildConfig) {
    try {
        const { guild_id } = config;
        const res = await collections.guild_config?.replaceOne({ guild_id }, config, { upsert: true });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}

export async function removeGuildConfigFromDatabase(guild_id: string) {
    try {
        const res = await collections.guild_config?.deleteOne({ guild_id });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}


function _getDefaultGuildConfig(guild_id: string): GuildConfig {
    return {
        guild_id,
        scheduled_messages_module: {
            enabled: false
        },
        games_module: {
            enabled: true
        },
        message_tracker_module: {
            enabled: true
        },
        welcome_module: {
            enabled: true,
            discord_mode: true,
            custom_welcome_message: null,
            welcome_channel: null
        }
    }
}
