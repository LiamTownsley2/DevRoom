import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js'
import { askStringQuestion, askButtonQuestion, askTextChannelQuestion, command, convertTimeString, getCommandReference, scheduleExecution, TIMEOUT_LIST } from '../../utils'
import { getGuildScheduledMessages, getScheduledMessages, insertScheduledMessageToDatabase, removeScheduledMessageFromDatabase } from '../../services';
import { CustomEmbeds } from '../../config/embeds';
import { ScheduledMessage } from '../../types';

const meta = new SlashCommandBuilder()
    .setName('scheduled-message')
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
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);


export default command(meta, async ({ interaction, client, config }) => {
    if (!interaction.guild) return;
    if (!interaction.channel) return;

    if (!config.scheduled_messages_module.enabled) return interaction.reply({ embeds: [CustomEmbeds.general.command_disabled()], ephemeral: true });

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

            switch (frequency) {
                case 1:
                    let time_of_day = await askStringQuestion('Please enter what time of the day you would like this message to be sent at, in 24 hour notation. (ex: 23:00)?', interaction.channel as TextChannel, interaction.user);
                    while (!(/\d{1,2}:\d{1,2}/gi.test(time_of_day!))) {
                        time_of_day = await askStringQuestion([
                            '⚠️ **Warning**: You need to enter the time like this: `23:00` for 11 PM.',
                            '',
                            'Please enter what time of the day you would like this message to be sent at, in 24 hour notation. (ex: 23:00)?'].join('\n'), interaction.channel as TextChannel, interaction.user);
                    }
                    let _time = time_of_day!.split(':');

                    let one_schedule: ScheduledMessage = {
                        guild_id: interaction.guild.id,
                        channel_id: channel!,
                        message: content!,
                        author_id: interaction.user.id,
                        author_avatar: interaction.user.displayAvatarURL({ forceStatic: true, extension: 'png' }),
                        author_username: interaction.user.username,
                        delay: {
                            type: 'time',
                            hour: parseInt(_time[0]),
                            minute: parseInt(_time[1])
                        },
                        last_sent: null,
                        created_at: new Date(),
                    }
                    await scheduleExecution(one_schedule, client);
                    await insertScheduledMessageToDatabase(one_schedule);
                    break;
                case 2:
                    let custom_delay = await askStringQuestion('Please enter how long of a gap you want inbetween the messages sending in timestring format `(ex: 2h 30m 25s)`', interaction.channel as TextChannel, interaction.user);
                    let seconds = convertTimeString(custom_delay!);

                    while (!convertTimeString(custom_delay!) || seconds > 604800 || seconds < 60) { // 604800 = 1 week
                        let warning;
                        if(seconds > 604800) warning = 'You cannot schedule a message for longer than a week away.';
                        if(seconds < 60) warning = 'You cannot schedule a message for less than a minute away.';

                        custom_delay = await askStringQuestion([
                            `⚠️ **Warning**: ${warning}`,
                            '',
                            'Please enter how long of a gap you want inbetween the messages sending in timestring format `(ex: 2h 30m 25s)`'].join('\n'), interaction.channel as TextChannel, interaction.user);
                        seconds = convertTimeString(custom_delay!);
                    }

                    let two_schedule: ScheduledMessage = {
                        guild_id: interaction.guild.id,
                        channel_id: channel!,
                        author_id: interaction.user.id,
                        author_avatar: interaction.user.displayAvatarURL({ forceStatic: true, extension: 'png' }),
                        author_username: interaction.user.username,
                        message: content!,
                        delay: {
                            type: 'custom',
                            seconds
                        },
                        last_sent: null,
                        created_at: new Date()
                    };

                    await scheduleExecution(two_schedule, client);
                    const res = await insertScheduledMessageToDatabase(two_schedule)
                    if (!res) {
                        return interaction.editReply({
                            embeds: [CustomEmbeds.modules.schedule_messages.create_failure(`There is already a scheduled message for this channel. Please remove it before trying again. ${await getCommandReference('schedule-message', 'list', client)}`)]
                        })
                    }
                    break;
            }

            return interaction.editReply({
                embeds: [await CustomEmbeds.modules.schedule_messages.create_success(client)]
            });

            break;
        case 'delete':
            const delete_id = interaction.options.getString('id', true);
            const delete_message = await getScheduledMessages(delete_id);
            if (!delete_message) return interaction.editReply({
                embeds: [CustomEmbeds.general.not_found(delete_id)]
            });

            if (delete_message.author_id == interaction.user.id || !interaction.memberPermissions?.has('Administrator')) {
                await removeScheduledMessageFromDatabase(delete_id);
                const _timeout = TIMEOUT_LIST.get(delete_message.channel_id);
                clearTimeout(_timeout as NodeJS.Timer);
                clearInterval(_timeout as NodeJS.Timeout);
                TIMEOUT_LIST.delete(delete_message.channel_id);

                return interaction.editReply({
                    embeds: [CustomEmbeds.modules.schedule_messages.delete_success(delete_id)]
                });
            } else {
                return interaction.editReply({
                    embeds: [CustomEmbeds.modules.schedule_messages.delete_failure(delete_id, 'You do not have permission to edit this Scheduled Message as you either did not create it nor do you have Administrator permission.')]
                })
            }
            break;
        case 'view':
            const view_id = interaction.options.getString('id', true);
            const view_message = await getScheduledMessages(view_id);
            if (!view_message) return interaction.editReply({
                embeds: [CustomEmbeds.general.not_found(view_id)]
            });

            return interaction.editReply({
                embeds: [CustomEmbeds.modules.schedule_messages.view(view_message)],
            })
            break;
        case 'list':
            const list_messages = await getGuildScheduledMessages(interaction.guild.id);
            if (!list_messages) return interaction.editReply({
                embeds: [CustomEmbeds.general.not_found()]
            });

            return interaction.editReply({
                embeds: [await CustomEmbeds.modules.schedule_messages.list(list_messages, client)]
            })
            break;

    }
})