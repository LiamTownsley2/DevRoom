import { PresenceUpdateStatus } from "discord.js";
import { collections } from "..";
import { IConfig } from "../../types";

export async function getConfigFromDatabase(guild_id: string): Promise<IConfig> {
    try {
        let res = await collections.config?.findOne({ guild_id }, {});
        if (!res) {
            res = _getDefaultConfig(guild_id);
        }
        return res as IConfig;
    } catch (err) {
        console.log('[database] ', err);
        return _getDefaultConfig(guild_id);
    }
}

export async function insertConfigToDatabase(guild_id: string, config: IConfig) {
    try {
        const res = await collections.config?.replaceOne({ guild_id }, config, { upsert: true });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}

export async function removeRoleFromMenu(menuId: string, roleId: string) {
    try {
        const filter = { name: menuId };
        const update = { $pull: { 'roles': { role_id: roleId } } };

        const res = await collections.config?.updateOne(filter, update);
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}

function _getDefaultConfig(guild_id: string): IConfig {
    return {
        guild_id,
        status: {
            message: 'The bot is now ready!',
            status: PresenceUpdateStatus.Online,
            type: 1
        },
        logging: {
            bot_logs: null
        },
    }
}
