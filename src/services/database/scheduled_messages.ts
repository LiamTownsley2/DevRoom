import { ObjectId } from "mongodb";
import { collections } from "..";
import { ScheduledMessage } from "../../types";

export async function getAllScheduledMessages(): Promise<ScheduledMessage[] | undefined> {
    try {
        let res = await collections.scheduled_messages?.find().toArray();
        return res as ScheduledMessage[];
    } catch (err) {
        console.log('[database] ', err);
    }
}

export async function getGuildScheduledMessages(guild_id:string): Promise<ScheduledMessage[] | undefined> {
    try {
        let res = await collections.scheduled_messages?.find({ guild_id }).toArray();
        return res as ScheduledMessage[];
    } catch (err) {
        console.log('[database] ', err);
    }
}

export async function getScheduledMessages(id: string): Promise<ScheduledMessage | undefined> {
    try {
        let res = await collections.scheduled_messages?.findOne({ _id: new ObjectId(id) });
        return res as ScheduledMessage;
    } catch (err) {
        console.log('[database] ', err);
    }
}

export async function insertScheduledMessageToDatabase(message: ScheduledMessage) {
    try {
        const { guild_id, channel_id } = message;
        const res = await collections.scheduled_messages?.replaceOne({ guild_id, channel_id }, message, { upsert: true });
        return !(res?.matchedCount > 0);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}

export async function removeScheduledMessageFromDatabase(id: string) {
    try {
        const res = await collections.scheduled_messages?.deleteOne({ _id: new ObjectId(id) });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}