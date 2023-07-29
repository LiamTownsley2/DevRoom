import { collections } from "..";
import { GuildConfig } from "../../types";
import CustomCache from "../../utils/custom_cache";

const guild_config_cache = new CustomCache<GuildConfig>()

export async function getGuildConfig(guild_id: string) {
    let config;
    if (guild_config_cache.get(guild_id)) {
        config = guild_config_cache.get(guild_id)?.value
        return config;
    }
    if (config == undefined) config = _getDefaultGuildConfig(guild_id);

    guild_config_cache.set(guild_id, {
        value: config,
        expiration: 2 * 60000 // * 60000 = Minutes to Milliseconds
    })
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
        automessage_module: {
            enabled: false,
            server_messages: []
        },
        games_module: {
            enabled: true
        },
        messagetracker_module: {
            enabled: true
        },
        welcome_module: {
            enabled: true,
            discord_mode: true,
            custom_welcome_message: null
        }
    }
}