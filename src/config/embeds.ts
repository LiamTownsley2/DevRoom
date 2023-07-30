import { APIEmbed, User } from 'discord.js';
import { GuildConfig, ScheduledMessage, StockChartType, UserStats } from '../types';
import { getCommandReference, getTimeUntilTargetTime } from '../utils';
import CustomClient from '../client/CustomClient';

const DISCORD_WELCOME = [
    '{{USER}} joined the party.',
    '{{USER}} just showed up!',
    'A wild {{USER}} has appeared.',
    'Welcome {{USER}}, Say hi!',
    '{{USER}} is here.',
    'Yay you made it, {{USER}}!',
    'Good to see you, {{USER}}.',
    '{{USER}} just landed.',
    'Glad you\'re here, {{USER}}.',
    'Welcome. {{USER}}. We hope you\'ve brought pizza.',
    '{{USER}} just slide into the server.'
];

export const CustomEmojis = {
    right_chevron: '<:right_chevron:1135177000546484275>',
    left_chevron: '<:left_chevron:1135176998193467414>',
}

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
        async create_success(client: CustomClient): Promise<APIEmbed> {
            return {
                ...DefaultEmbed,
                title: '⏰ Scheduled Message Created',
                description: `Your scheduled message has been created successfully, use the ${await getCommandReference('schedule-message', 'list', client,)} to view all the active scheduled messages.`,
                color: CustomColours.info
            }
        },

        create_failure(reason?: string): APIEmbed {
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

        async list(messages: ScheduledMessage[], client:CustomClient): Promise<APIEmbed> {
            let ids = [];
            let channels = [];
            let createdAt = [];
            let sendingAt = [];
            if(!messages || messages.length == 0) return {
                ...DefaultEmbed,
                title: '🔗 All Guild Scheduled Messages',
                description:  `There are no scheduled messages created yet, use the ${await getCommandReference('schedule-message', 'create', client)} command to create one.`
            }
            for (const message of messages) {
                ids.push(message._id);
                channels.push(message.channel_id);
                createdAt.push(Math.floor(message.created_at.getTime() / 1000));
                let delay = (message.delay.type == 'custom') ? message.delay.seconds : getTimeUntilTargetTime(message.delay) / 1000
                sendingAt.push(Math.floor(((message.last_sent || new Date()).getTime() + (delay * 1000)) / 1000))
            }

            return {
                ...DefaultEmbed,
                title: '🔗 All Guild Scheduled Messages',
                fields: [
                    { name: 'ID', value: ids.map(x => `\`${x}\``).join('\n'), inline: true },
                    { name: 'Channel', value: channels.map(x => `<#${x}>`).join('\n'), inline: true },
                    { name: 'Sending At', value: sendingAt.map(x => (x > 0) ? `<t:${x}:R>` : 'Now').join('\n'), inline: true },

                ],
                color: CustomColours.info
            }
        }
    },

    games: {
        rps: {
            move(playerMove: string, authorUser?: User, challengedUser?: User, challengedMove?: string): APIEmbed {
                const emojis: { [key: string]: string } = {
                    'rock': '🗻',
                    'paper': '📰',
                    'scissors': '✂'
                }
                const choices = ["rock", "paper", "scissors"];
                const botMove = choices[Math.floor(Math.random() * choices.length)];

                if (challengedUser) {
                    let fields = [
                        { name: `${authorUser?.username}'s Move`, value: '🐱‍👤 Move Hidden', inline: true },
                        { name: `${challengedUser.username}'s Move`, value: `⌛ Awaiting Move...`, inline: true },
                    ]
                    if (challengedMove) {
                        fields = [
                            { name: `${authorUser?.username}'s Move`, value: `${emojis[playerMove]} \`${playerMove.toUpperCase()}\``, inline: true },
                            { name: `${challengedUser.username}'s Move`, value: `${emojis[challengedMove]} \`${challengedMove.toUpperCase()}\``, inline: true },

                        ]
                    }
                    return {
                        ...DefaultEmbed,
                        title: '🎮 Rock, Paper, Scissors!',
                        fields,
                        color: CustomColours.purple
                    }
                } else {
                    return {
                        ...DefaultEmbed,
                        title: `🎮 Rock, Paper, Scissors!`,
                        fields: [
                            { name: 'You Picked', value: `${emojis[playerMove]} \`${playerMove.toUpperCase()}\``, inline: true },
                            { name: '🤖 Picked', value: `${emojis[botMove]} \`${botMove.toUpperCase()}\``, inline: true },
                        ],
                        color: CustomColours.purple
                    }
                }
            },

            challenge_sent(sent_to: User): APIEmbed {
                return {
                    ...DefaultEmbed,
                    title: '🎮 Challenge Sent',
                    description: `You have sent a challenge for a game of Rock Paper Scissors to ${sent_to.toString()}.`,
                    color: CustomColours.purple
                }
            },

            move_sent(sent_to: User): APIEmbed {
                return {
                    ...DefaultEmbed,
                    title: '🎮 Move Sent',
                    description: `You have sent a move for a game of Rock Paper Scissors to ${sent_to.toString()}.`,
                    color: CustomColours.purple
                }
            }
        }
    },

    not_found(id?: string): APIEmbed {
        if (id) {
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
    },

    command_disabled(): APIEmbed {
        return {
            ...DefaultEmbed,
            title: '🔒 Command Disabled',
            description: 'This command has been disabled by a Guild Administrator.',
            color: CustomColours.warning
        }
    },

    stock: {
        stock_vaild(symbol: string, type: StockChartType): APIEmbed {
            return {
                title: `📈 Stock Market Data`,
                fields: [
                    { name: 'Symbol', value: `\`$${symbol}\``, inline: true },
                    { name: 'Data Filter', value: `${type.toUpperCase()}`, inline: true }
                ],
                image: {
                    url: 'attachment://stock.png'
                },
                footer: {
                    text: 'Powered by Alpha Vantage API.'
                },
                color: CustomColours.info,
                timestamp: new Date().toISOString()
            }
        },

        stock_invalid(): APIEmbed {
            return {
                title: '📈 Stock Invalid',
                description: 'The stock you entered cannot be found. Are you sure this is a valid stock symbol?',
                color: CustomColours.warning
            }
        }
    },

    welcome_module: {
        member_join(user: User, discord_mode: boolean, config: GuildConfig): APIEmbed {
            let message: string | undefined;
            if (discord_mode) {
                let _discordMessage = DISCORD_WELCOME[Math.floor(Math.random() * DISCORD_WELCOME.length)]
                message = _discordMessage;
            } else {
                message = config.welcome_module.custom_welcome_message ?? undefined
            }

            message = message?.replace(/{{USER}}/gi, user.toString()).replace(/{{USERNAME}}/gi, user.username);


            return {
                ...DefaultEmbed,
                title: '↪ Member Joined',
                description: message ?? `Welcome ${user.toString()} to the guild!`,
                thumbnail: {
                    url: user.displayAvatarURL()
                }
            }
        }
    },

    message_tracking_module: {
        leaderboard(users: UserStats[] | undefined, page_number: number, total_pages: number, page_length: number): APIEmbed {
            if (!users || users.length == 0) {
                return {
                    title: '🏆 Guild Messages Leaderboard',
                    description: 'There are no users to display on this page.',
                    color: CustomColours.purple
                }
            }

            return {
                title: '🏆 Guild Messages Leaderboard',
                fields: [
                    {
                        name: '#', inline: true,
                        value: users.map((_, i) => `${i + 1}`).join('\n')
                    },
                    {
                        name: 'User', inline: true,
                        value: users.map(x => `<@${x.user_id}>`).join('\n')
                    },
                    {
                        name: 'Messages', inline: true,
                        value: users.map(x => x.messages).join('\n')
                    },
                ],
                color: CustomColours.purple
            }
        },
    }
}