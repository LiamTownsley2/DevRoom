import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import { insertGuildConfigToDatabase } from '../../services';

const meta = new SlashCommandBuilder()
    .setName('manage-welcome')
    .setDescription('Manage the config for the Welcome Messages!')
    .addSubcommand((opt) => opt
        .setName('set-mode')
        .setDescription('The mode will determine what type of messages that the bot welcomes a user with.')
        .addStringOption((opt) => opt
            .setName('mode')
            .setDescription('The mode you want to select.')
            .setChoices(
                { name: 'Discord Mode', value: 'true' },
                { name: 'Custom Welcome Message', value: 'false' }
            )
            .setRequired(true)
        )
    )
    .addSubcommand((opt) => opt
        .setName('set-message')
        .setDescription('This will set the message for the Custom Welcome Message type!.')
        .addStringOption((opt) => opt
            .setName('message')
            .setDescription('Placeholders: {{USER}} to mention the user | {{USERNAME}} say their name.')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);


export default command(meta, async ({ interaction, client, config }) => {
    switch (interaction.options.getSubcommand(true)) {
        case 'set-mode':
            const isDiscordMode = interaction.options.getString('mode', true) == 'true';
            config.welcome_module.discord_mode = isDiscordMode;
            break;
        case 'set-message':
            const message = interaction.options.getString('message', true);
            config.welcome_module.custom_welcome_message = message;
            config.welcome_module.discord_mode = false;
            break;
    }

    await insertGuildConfigToDatabase(config);
})