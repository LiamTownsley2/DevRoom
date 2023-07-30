import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { command } from '../../utils'
import { CustomEmbeds } from '../../config/embeds'

const meta = new SlashCommandBuilder()
    .setName('guide')
    .setDescription('Get a guide to explain how to use the bots code features!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    
export default command(meta, async ({ interaction, client, config }) => {
    if(!interaction.guild) return;
    
    await interaction.reply({
        ephemeral: true,
        embeds: [await CustomEmbeds.modules.setup.guide(client, interaction.guild.id)]
    });
})