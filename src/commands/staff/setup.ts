import { SlashCommandBuilder, TextChannel } from 'discord.js'
import { askButtonQuestion, askStringQuestion, askTextChannelQuestion, command } from '../../utils'
import { CustomEmbeds } from '../../config/embeds'
import { MODULES } from './module'
import { insertGuildConfigToDatabase } from '../../services'

const meta = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup the bot and configure your guild!')

export default command(meta, async ({ interaction, client, config }) => {
    await interaction.deferReply({ ephemeral: true });

    for (const module of MODULES) {
        const isEnabled = await askButtonQuestion(`Would you like to enable the \`${module.toUpperCase()}\` module?`, interaction.channel as TextChannel, interaction.user, ['✅', '❌']) == 1

        if (module == 'Welcome') config.welcome_module.enabled = isEnabled;
        if (module == 'Scheduled Messages') {
            config.scheduled_messages_module.enabled = isEnabled;
        }
        if (module == 'Message Tracker') config.message_tracker_module.enabled = isEnabled;
        if (module == 'Games') config.games_module.enabled = isEnabled;
    }

    if (config.welcome_module.enabled == true) {
        const channel = await askTextChannelQuestion('What channel would you like the bot to send the guild Welcome messages in?', interaction.channel as TextChannel, interaction.user);
        if (!channel) return;

        const isDiscordMode = await askButtonQuestion('Would you like to use \`Discord Mode\` for your welcome messages? It picks from a random set of pre-determined strings to give each user a different welcome message.', interaction.channel as TextChannel, interaction.user, ['✅', '❌']) == 1;
        let customMessage;
        if (!(isDiscordMode == true)) {
            customMessage = await askStringQuestion([
                'What would you like the Welcome message to say?',
                '',
                '**Placeholders**:',
                '`{{USER}}` mentions the user.',
                '`{{USERNAME}} lists their username.`'
            ].join('\n'), interaction.channel as TextChannel, interaction.user)
        }

        config.welcome_module.welcome_channel = channel;
        config.welcome_module.enabled = isDiscordMode;
        config.welcome_module.custom_welcome_message = customMessage ?? null;
    }

    await insertGuildConfigToDatabase(config);

    await interaction.editReply({
        embeds: [await CustomEmbeds.modules.setup.server_configured(client)]
    });
})