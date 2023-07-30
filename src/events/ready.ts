import { TextChannel } from 'discord.js';
import { event, getTimeUntilTargetTime, scheduleExecution } from '../utils';
import { ScheduledMessage } from '../types';
import { getAllScheduledMessages, guild_config_cache, insertScheduledMessageToDatabase } from '../services';
import CustomClient from '../client/CustomClient';

export default event('ready', async ({ client }) => {
    if (!client.user) return;
    client.log(`ready`, `Logged in as ${client.user.tag}`);

    setInterval(() => {
        guild_config_cache.forEach((entry, key) => {
            let hasExpired = guild_config_cache.hasExpired(key) == true;
            if (hasExpired) {
                guild_config_cache.delete(key);
            }
        })
    }, 1 * 60000) // * 60000 = Minutes To Milliseconds


    const scheduled_messages = await getAllScheduledMessages();
    if (scheduled_messages) {
        for (const message of scheduled_messages) {
            await scheduleExecution(message, client);
        }
    }
})