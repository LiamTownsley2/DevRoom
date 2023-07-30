import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { askStringQuestion, askButtonQuestion, askTextChannelQuestion, command, askSelectMenuQuestion, convertTimeString } from '../../utils'
import { insertScheduledMessageToDatabase } from '../../services';

const meta = new SlashCommandBuilder()
    .setName('schedule-message')
    .setDescription('Manage your guilds scheduled messages.')
    .addSubcommand((opt) => opt
        .setName('create')
        .setDescription('Create a new scheduled message!')
    )
    .addSubcommand((opt) => opt
        .setName('delete')
        .setDescription('Delete a scheduled message!')
        .addStringOption((opt) => opt
            .setName('id')
            .setDescription('The ID of the Scheduled Message')
            .setRequired(true)
        )
    )
    .addSubcommand((opt) => opt
        .setName('list')
        .setDescription('List all scheduled messages!')
    )
    .addSubcommand((opt) => opt
        .setName('view')
        .setDescription('Preview a scheduled message')
        .addStringOption((opt) => opt
            .setName('id')
            .setDescription('The ID of the Scheduled Message')
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);


export default command(meta, async ({ interaction, client }) => {
    if(!interaction.guild) return;
    if(!interaction.channel) return;

    await interaction.deferReply({ ephemeral: true });
    
    switch (interaction.options.getSubcommand(true)) {
        case 'create':
            const content = await askStringQuestion('What would you like the content of the Scheduled message to be?', interaction.channel as TextChannel, interaction.user);
            const channel = await askTextChannelQuestion('What channel would you like this message to be scheduled in?', interaction.channel as TextChannel, interaction.user);
            const frequency = await askButtonQuestion([
                'How would you want this message to be scheduled? Select the appropriate Emoji Button below!',
                '',
                '',
                '1️⃣ **Time of Day**: You can use this option to select what Time of Day you want this message to be sent.',
                '2️⃣ **Custom Delay**: This message will be sent in the selected channel on a delay that you determine.'
            ].join('\n'), interaction.channel as TextChannel, interaction.user, ['1️⃣', '2️⃣']);
            console.log(frequency);
            switch (frequency) {
                case 1:
                    let time_of_day = await askStringQuestion('Please enter what time of the day you would like this message to be sent at, in 24 hour notation. (ex: 23:00)?', interaction.channel as TextChannel, interaction.user);
                    while (!(/\d{0,3}:\d{0,3}/gi.test(time_of_day!))) {
                        time_of_day = await askStringQuestion([
                            '⚠️ **Warning**: You need to enter the time like this: `23:00` for 11 PM.',
                            '',
                            'Please enter what time of the day you would like this message to be sent at, in 24 hour notation. (ex: 23:00)?'].join('\n'), interaction.channel as TextChannel, interaction.user);
                    }
                    let _time = time_of_day!.split(':');
                    
                    await insertScheduledMessageToDatabase({
                        guild_id: interaction.guild.id,
                        channel_id: channel!,
                        message: content!,
                        delay: {
                            type: 'time',
                            hour: parseInt(_time[0]),
                            minute: parseInt(_time[1])
                        },
                        last_sent: null
                    });
                    break;
                case 2:
                    let custom_delay = await askStringQuestion('Please enter how long of a gap you want inbetween the messages sending in timestring format (ex: 2h 30m 25s)', interaction.channel as TextChannel, interaction.user);
                    let seconds = convertTimeString(custom_delay!);
                    
                    await insertScheduledMessageToDatabase({
                        guild_id: interaction.guild.id,
                        channel_id: channel!,
                        message: content!,
                        delay: {
                            type: 'custom',
                            seconds
                        },
                        last_sent: null
                    })
                    break;
            }

            break;
        case 'delete':

            break;
        case 'list':

            break;
        case 'view':

            break;
    }

    return interaction.editReply({
        content: 'Success!'
    });
})