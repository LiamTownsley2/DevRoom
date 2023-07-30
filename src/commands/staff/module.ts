import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { TIMEOUT_LIST, command } from '../../utils'
import { insertGuildConfigToDatabase } from '../../services';
import { CustomEmbeds } from '../../config/embeds';

const meta = new SlashCommandBuilder()
    .setName('module')
    .setDescription('Manage the active modules.')
    .addSubcommand((opt) => opt
        .setName('enable')
        .setDescription('Enable a Guild Module')
        .addStringOption((opt) => opt
            .setName('name')
            .setDescription('The name of the module')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((opt) => opt
        .setName('disable')
        .setDescription('Disable a Guild Module')
        .addStringOption((opt) => opt
            .setName('name')
            .setDescription('The name of the module')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);


const MODULES = ['Welcome', "Scheduled Messages", "Message Tracker", "Games"];

export default command(meta, async ({ interaction, client, config }) => {
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString('name', true);
    const isEnabled = interaction.options.getSubcommand(true) == 'enable';

    if (!MODULES.includes(name)) return;

    if (name == 'Welcome') config.welcome_module.enabled = isEnabled;
    if (name == 'Scheduled Messages') {
        config.scheduled_messages_module.enabled = isEnabled;
        TIMEOUT_LIST.forEach((v) => {
            clearTimeout(v as NodeJS.Timer);
            clearInterval(v as NodeJS.Timeout);
        })
    }
    if (name == 'Message Tracker') config.message_tracker_module.enabled = isEnabled;
    if (name == 'Games') config.games_module.enabled = isEnabled;

    await insertGuildConfigToDatabase(config);

    return interaction.editReply({
        embeds: [CustomEmbeds.general.success(`${(isEnabled == true) ? '✅ Module Successfully Enabled' : '❌ Module Successfully Disabled'}`, `The action performed on module \`${name}\` was a success.`)]
    })
}, async ({ interaction }) => {
    if (!interaction.guild) return;
    const focusedValue = interaction.options.getFocused();
    await interaction.respond(MODULES
        .filter(x => x.startsWith(focusedValue))
        .map(x => { return { name: x, value: x } })
    );
})