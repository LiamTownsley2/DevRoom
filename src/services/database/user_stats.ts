import { collections } from "..";
import { UserStats } from "../../types";

export async function getAllUserStats(guild_id: string): Promise<UserStats[] | undefined> {
    try {
        let res = await collections.user_stats?.find({ guild_id }).toArray()
        if (!res) return undefined;
        return res as UserStats[];
    } catch (err) {
        console.log('[database] ', err);
    }
}

export async function getUserStats(guild_id: string, user_id: string): Promise<UserStats> {
    try {
        let res = await collections.user_stats?.findOne({ guild_id, user_id });
        if (!res) return _getDefaultUserStats(guild_id, user_id);
        return res as UserStats;
    } catch (err) {
        console.log('[database] ', err);
        return _getDefaultUserStats(guild_id, user_id);
    }
}

export async function insertUserStatsToDatabase(stats: UserStats) {
    try {
        const { guild_id, user_id } = stats;
        const res = await collections.user_stats?.replaceOne({ guild_id, user_id }, stats, { upsert: true });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}

export async function removeUserStatsFromDatabase(guild_id: string, user_id: string) {
    try {
        const res = await collections.user_stats?.deleteOne({ guild_id, user_id });
        return !(res == undefined);
    } catch (err) {
        console.log('[database] ', err);
        return false;
    }
}


function _getDefaultUserStats(guild_id: string, user_id: string): UserStats {
    return {
        guild_id,
        user_id,
        messages: 0
    }
}
