import { Collection, TextChannel } from 'discord.js';
import CustomClient from '../client/CustomClient';
import { getGuildConfig, insertScheduledMessageToDatabase } from '../services';
import { ScheduledMessage, TimeOfDay } from '../types';

export * from './commands';
export * from './events';
export * from './buttons';
export * from './questions';

/**
 * Convert a Time Strings into seconds.
 * @param timestring The timestring (ex. 2d 30m 25s)
 * @returns number
 */
export function convertTimeString(timestring: string) {
    const timesplit = timestring.split(' ');
    let final_time = 0;
    for (const time of timesplit) {
        const number = parseInt(time.replace(/\D/g, ''));

        if (time.endsWith('M')) final_time += 2_630_000 * number;
        if (time.endsWith('W')) final_time += 604_800 * number;
        if (time.endsWith('w')) final_time += 604_800 * number;
        if (time.endsWith('d')) final_time += 86400 * number;
        if (time.endsWith('h')) final_time += 3600 * number;
        if (time.endsWith('m')) final_time += 60 * number;
        if (time.endsWith('s')) final_time += 1 * number;
    }
    return final_time;
}

/**
 * Check if enough time has passed and if the provided time has elapsed.
 * @param lastSent The date you want to check against.
 * @param delaySeconds How many seconds to check have elapsed since the lastSent date.
 * @returns boolean
 */
export function hasEnoughTimePassed(lastSent: Date, delaySeconds: number): boolean {
    const currentTime = new Date();
    const timeDifferenceInSeconds = (currentTime.getTime() - lastSent.getTime()) / 1000;
    return timeDifferenceInSeconds >= delaySeconds;
}

/**
 * Check how long it is until the targetTime needs executed again and then return the delay needed.
 * @param targetTime A TimeOFDay object
 * @returns number
 */
export function getTimeUntilTargetTime(targetTime: TimeOfDay): number {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setHours(targetTime.hour);
    targetDate.setMinutes(targetTime.minute);
    targetDate.setSeconds(0);
    targetDate.setMilliseconds(0);

    if (targetDate <= now) {
        targetDate.setDate(targetDate.getDate() + 1);
    }

    return targetDate.getTime() - now.getTime();
}

/**
 * This collection is used to ensure that scheduled messages can be disabled once started. It stores timer IDs.
 */
export const TIMEOUT_LIST: Collection<string, NodeJS.Timer | NodeJS.Timeout> = new Collection();

/**
 * Schedule for a message to be sent and looped.
 * @param scheduledMessage The ScheduledMessage Database object.
 * @param client The CustomClient object.
 * @returns 
 */
export async function scheduleExecution(scheduledMessage: ScheduledMessage, client: CustomClient) {
    const channel = await client.channels.fetch(scheduledMessage.channel_id) as TextChannel;
    const config = await getGuildConfig(scheduledMessage.guild_id);
    if(!config.scheduled_messages_module.enabled) return;
    if (scheduledMessage.delay.type === "time") {
        const timeUntilExecution = getTimeUntilTargetTime(scheduledMessage.delay);
        const timeout_id = setTimeout(async () => {
            await channel.send({
                content: scheduledMessage.message
            });
            scheduledMessage.last_sent = new Date();
            await insertScheduledMessageToDatabase(scheduledMessage);

            await scheduleExecution(scheduledMessage, client);
        }, timeUntilExecution);
        TIMEOUT_LIST.set(scheduledMessage.channel_id, timeout_id);
    } else if (scheduledMessage.delay.type === "custom") {
        const interval = scheduledMessage.delay.seconds * 1000;
        const timeout_id = setInterval(async () => {
            await channel.send({
                content: scheduledMessage.message
            });
            scheduledMessage.last_sent = new Date();
            await insertScheduledMessageToDatabase(scheduledMessage);
        }, interval);
        TIMEOUT_LIST.set(scheduledMessage.channel_id, timeout_id);
    }
}