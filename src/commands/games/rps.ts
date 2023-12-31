import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import { CustomEmbeds } from '../../config/embeds'
import { RPSMove } from '../../types'

let RPS_MOVES: RPSMove[] = [];

const meta = new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play a game of Rock, Paper, Scissors!')
    .addStringOption((opt) => opt
        .setName('action')
        .setDescription('Select what you want to use!')
        .addChoices(
            { name: 'Rock', value: 'rock' },
            { name: 'Paper', value: 'paper' },
            { name: 'Scissors', value: 'scissors' }
        )
        .setRequired(true)
    )
    .addUserOption((opt) => opt
        .setName('challenge')
        .setDescription('(OPTIONAL) Select a user you want to challenge to a game!')
    )

export default command(meta, async ({ interaction, client, config }) => {
    if (!config.games_module.enabled) return interaction.reply({ embeds: [CustomEmbeds.general.command_disabled()], ephemeral: true });
    
    const move = interaction.options.getString('action', true);
    const challenge_user = interaction.options.getUser('challenge');
    
    if (challenge_user) {
        
        let returningMove = RPS_MOVES.find(x => x.author.id == challenge_user.id && x.opponent.id == interaction.user.id);
        if (returningMove) {
            (await interaction.channel!.messages.fetch(returningMove.message_id)).edit({
                embeds: [CustomEmbeds.modules.games.rps.move(returningMove.author_move, returningMove.author, returningMove.opponent, move)]
            });

            RPS_MOVES = RPS_MOVES.filter(x => !(x.opponent.id == interaction.user.id));
            
            return await interaction.reply({
                embeds: [CustomEmbeds.modules.games.rps.move_sent(returningMove.author)],
                ephemeral: true
            })
        }

        const _challenge = await interaction.channel!.send({
            content: `${challenge_user.toString()}, you have been challenged to a game by ${interaction.user.toString()}`,
            embeds: [CustomEmbeds.modules.games.rps.move(move, interaction.user, challenge_user)],
        })

        RPS_MOVES.push({
            author: interaction.user,
            opponent: challenge_user,
            author_move: move,
            message_id: _challenge.id
        });

        return await interaction.reply({
            embeds: [CustomEmbeds.modules.games.rps.challenge_sent(challenge_user)],
            ephemeral: true
        });
    } else {
        return interaction.reply({
            embeds: [CustomEmbeds.modules.games.rps.move(move)],
            ephemeral: true
        })
    }
})