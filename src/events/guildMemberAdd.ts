import { TextChannel } from 'discord.js';
import { getGuildConfig } from '../services';
import { event } from '../utils';
import { CustomEmbeds } from '../config/embeds';

export default event('guildMemberAdd', async ({ client }, member) => {
    const config = await getGuildConfig(member.guild.id);
    
    if(!config.welcome_module.enabled) return;
    if(!config.welcome_module.welcome_channel) return;

    const welcome_channel = await client.channels.fetch(config.welcome_module.welcome_channel) as TextChannel;
    welcome_channel.send({
        embeds: [CustomEmbeds.modules.welcome.member_join(member.user, config.welcome_module.discord_mode, config)]
    })
})