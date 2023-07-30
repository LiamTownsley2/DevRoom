import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import { insertGuildConfigToDatabase } from '../../services';

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
    const name = interaction.options.getString('name', true);
    const value = interaction.options.getSubcommand(true) == 'enable';
    
    if(!MODULES.includes(name)) return;

    if(name == 'Welcome') config.welcome_module.enabled = value;
    if(name == 'Scheduled Messages') config.scheduled_messages_module.enabled = value;
    if(name == 'Message Tracker') config.message_tracker_module.enabled = value;
    if(name == 'Games') config.games_module.enabled = value;

    await insertGuildConfigToDatabase(config);
    
    return interaction.reply({
        ephemeral: true,
        content: 'Success!'
    });
}, async ({ interaction }) => {
    if (!interaction.guild) return;
    const focusedValue = interaction.options.getFocused();
    await interaction.respond(MODULES
        .filter(x => x.startsWith(focusedValue))
        .map(x => { return { name: x, value: x } } )
    );
})