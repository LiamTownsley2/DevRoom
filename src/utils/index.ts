import { Collection, TextChannel } from 'discord.js';
import CustomClient from '../client/CustomClient';
import { insertScheduledMessageToDatabase } from '../services';
import { ScheduledMessage, TimeOfDay } from '../types';

export * from './commands';
export * from './events';
export * from './buttons';
export * from './questions';

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

export function hasEnoughTimePassed(lastSent: Date, delaySeconds: number): boolean {
    const currentTime = new Date();
    const timeDifferenceInSeconds = (currentTime.getTime() - lastSent.getTime()) / 1000;
    console.log(timeDifferenceInSeconds);
    return timeDifferenceInSeconds >= delaySeconds;
}

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

export const TIMEOUT_LIST: Collection<string, NodeJS.Timer | NodeJS.Timeout> = new Collection();

export async function scheduleExecution(scheduledMessage: ScheduledMessage, client: CustomClient) {
    const channel = await client.channels.fetch(scheduledMessage.channel_id) as TextChannel;
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
        TIMEOUT_LIST.set(scheduledMessage._id!.toString(), timeout_id);
    } else if (scheduledMessage.delay.type === "custom") {
        const interval = scheduledMessage.delay.seconds * 1000;
        const timeout_id = setInterval(async () => {
            await channel.send({
                content: scheduledMessage.message
            });
            scheduledMessage.last_sent = new Date();
            await insertScheduledMessageToDatabase(scheduledMessage);
        }, interval);
        TIMEOUT_LIST.set(scheduledMessage._id!.toString(), timeout_id);
    }
}