import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'

const meta = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('The bot will reply with whatever you tell it to say.')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('Message to echo.')
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('Channel to send the message to, defaults to current channel.')
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);


export default command(meta, async ({ interaction, client }) => {
    const message: string | null = interaction.options.getString('message')
    if (!message) return;

    const channel = interaction.options.getChannel('channel')
    if (channel) {
        const _channel = interaction.client.channels.resolve(channel.id)
        if (!_channel?.isTextBased()) {
            return interaction.reply({
                ephemeral: true,
                content: 'The channel you selected is not a TextBased channel.'
            });
        }

        const _echoedmessage = await _channel.send({
            content: message
        });

        return interaction.reply({
            ephemeral: true,
            content: 'Success!'
        });

    }

    const _finalmessage = await interaction.channel?.send({
        content: message
    })
    if(!_finalmessage) return;

    return interaction.reply({
        ephemeral: true,
        content: 'Success!'
    });
})