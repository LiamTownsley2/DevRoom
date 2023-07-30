import { getUserStats, insertUserStatsToDatabase } from '../services';
import { event } from '../utils';

export default event('messageCreate', async ({ client }, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const stats = await getUserStats(message.guild.id, message.author.id);
    stats.messages = stats.messages + 1;
    await insertUserStatsToDatabase(stats);
})