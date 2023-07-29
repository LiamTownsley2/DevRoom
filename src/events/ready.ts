import { ActivityType, PresenceStatusData } from 'discord.js';
import { event } from '../utils';
import { RestrictedActivityType } from '../types';

export default event('ready', async ({ client }) => {
    client.log(`ready`, `Logged in as ${client.user?.tag}`);

    const config = await client.getConfig();
    if (!config) return;
    if (!client.user) return;

    client.user.setPresence({ activities: [{ name: config.status.message, type: (config.status.type ?? ActivityType.Playing) as RestrictedActivityType }], status: config.status.status as PresenceStatusData });
})