import { ActivityType, PresenceStatusData } from 'discord.js';
import { event } from '../utils';
import { RestrictedActivityType } from '../types';
import { getGuildConfig, guild_config_cache } from '../services';

export default event('ready', async ({ client }) => {
    client.log(`ready`, `Logged in as ${client.user?.tag}`);

    setInterval(() => {
        guild_config_cache.forEach((entry, key) => {
            let hasExpired = guild_config_cache.hasExpired(key) == true;
            if(hasExpired) {
                guild_config_cache.delete(key);
            }
        })
    }, 1 * 60000) // * 60000 = Minutes To Milliseconds

    if (!client.user) return;

    // client.user.setPresence({ activities: [{ name: config.status.message, type: (config.status.type ?? ActivityType.Playing) as RestrictedActivityType }], status: config.status.status as PresenceStatusData });
})