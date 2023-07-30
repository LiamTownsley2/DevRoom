import { APIEmbed } from 'discord.js';
import { ScheduledMessage } from '../types';
import { getCommandReference } from '../utils';
import CustomClient from '../client/CustomClient';

export const CustomColours = {
    general: 0x1abc9c,
    info: 0x3498db,
    error: 0xe74c3c,
    warning: 0xf1c40f,
    purple: 0x9b59b6
}

const DefaultEmbed: Partial<APIEmbed> = {
    footer: {
        text: `Oxi's DevRoom Submission`,
    },
    timestamp: new Date().toISOString(),
    color: CustomColours.general
}

export const CustomEmbeds = {
    schedule_module: {
        async create_success(client:CustomClient): Promise<APIEmbed> {
            return {
                ...DefaultEmbed,
                title: '⏰ Scheduled Message Created',
                description: `Your scheduled message has been created successfully, use the ${await getCommandReference('schedule-message', 'list', client,)} to view all the active scheduled messages.`,
                color: CustomColours.info
            }
        },

        create_failure(reason?:string): APIEmbed {
            return {
                ...DefaultEmbed,
                title: '❌ Scheduled Message Not Created',
                description: `Your scheduled message could not be created.${(reason) ? `\n\n**Reason**\n${reason}` : ''}`,
                color: CustomColours.error
            }
        },

        delete_success(delete_id: string): APIEmbed {
            return {
                ...DefaultEmbed,
                title: '✅ Deletion Success',
                description: `Your Scheduled Message with the ID \`${delete_id}\` was deleted successfully.`,
                color: CustomColours.info
            }
        },

        delete_failure(delete_id: string, reason?: string): APIEmbed {
            return {
                ...DefaultEmbed,
                title: '❌ Deletion Failure',
                description: [
                    `A Scheduled Message with the ID \`${delete_id}\` could not be deleted.`,
                    (reason) ? `\n**Reason**\n\`\`\`\n${reason}\`\`\`` : ''
                ].join('\n'),
                color: CustomColours.error
            }
        },

        view(message: ScheduledMessage): APIEmbed {
            return {
                ...DefaultEmbed,
                title: '📡 View Scheduled Message',
                author: {
                    name: message.author_username,
                    icon_url: message.author_avatar
                },
                fields: [
                    { name: 'Channel', value: `<#${message.channel_id}>`, inline: true },
                    { name: 'Created At', value: `<t:${Math.floor(message.created_at.getTime() / 1000)}:R>`, inline: true },
                    { name: 'Last Sent', value: (message.last_sent) ? `<t:${Math.floor(message.last_sent.getTime() / 1000)}:R>` : '-', inline: true },
                    { name: 'ID', value: message._id!.toString(), inline: false }

                ],
                description: `**Content**\n${message.message}`,
                color: CustomColours.info
            }
        },

        list(messages: ScheduledMessage[]): APIEmbed {
            let ids = [];
            let channels = [];
            let createdAt = [];

            for (const message of messages) {
                ids.push(message._id);
                channels.push(message.channel_id);
                createdAt.push(Math.floor(message.created_at.getTime() / 1000));

            }

            return {
                ...DefaultEmbed,
                title: '🔗 All Guild Scheduled Messages',
                fields: [
                    { name: 'ID', value: ids.map(x => `\`${x}\``).join('\n'), inline: true },
                    { name: 'Channel', value: channels.map(x => `<#${x}>`).join('\n'), inline: true },
                    { name: 'Created At', value: createdAt.map(x => `<t:${x}:R>`).join('\n'), inline: true }
                ],
                color: CustomColours.info            }
        }
    },

    not_found(id?: string): APIEmbed {
        if(id) {
            return {
                ...DefaultEmbed,
                title: `❔ Your Scheduled Message Couldn't Be Found`,
                description: `An attempt was made to try and find a message with the ID of \`${id}\` and it could not be found. Please try again.`,
                color: CustomColours.warning
            }
        } else {
            return {
                ...DefaultEmbed,
                title: `❔ Your Scheduled Message Couldn't Be Found`,
                description: `An attempt was made to try and find the requested scheduled message(s) and they could not be found. Please try again.`,
                color: CustomColours.warning
            }
        }
    },

    success(title: string, description: string): APIEmbed {
        return {
            ...DefaultEmbed,
            title,
            description,
            color: CustomColours.info
        }
    }
}