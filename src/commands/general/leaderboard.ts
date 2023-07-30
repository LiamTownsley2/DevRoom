import { ComponentType, SlashCommandBuilder } from 'discord.js'
import { command, getPageButtons, getPageFromArray } from '../../utils'
import { CustomEmbeds } from '../../config/embeds';
import { getAllUserStats, getUserStats } from '../../services';

const meta = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the guild leaderboard!')
    .addNumberOption((opt) => opt
        .setName('page')
        .setDescription('The page you want to view')
        .setMaxValue(9999)
        .setMinValue(1)
    )

export default command(meta, async ({ interaction, client }) => {
    if (!interaction.guild) return;

    let page_num = interaction.options.getNumber('page') ?? 1;
    const list_res = await getAllUserStats(interaction.guild.id);
    const PAGE_LEGNTH = 25;
    const arr = getPageFromArray(list_res!.sort((a, b) => b.messages - a.messages), page_num, PAGE_LEGNTH)
    const max_pages = Math.ceil(list_res!.length / PAGE_LEGNTH);


    const _reply = await interaction.reply({
        embeds: [CustomEmbeds.message_tracking_module.leaderboard(arr, page_num, max_pages, PAGE_LEGNTH)],
        components: [await getPageButtons(page_num, max_pages)]
    });

    let cur_page_num = interaction.options.getNumber('page') ?? 1;
    const collector = _reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (i) => {
            i.deferUpdate()
            if (!i.customId.startsWith('page_button')) return false;
            return i.user.id == interaction.user.id;
        },
        time: 600_000 // 600_000 = 10 minutes
    })

    collector.on('collect', async (col) => {
        if (col.customId.endsWith('right')) {
            cur_page_num++;
            await interaction.editReply({
                embeds: [CustomEmbeds.message_tracking_module.leaderboard(
                    getPageFromArray(list_res!, cur_page_num, PAGE_LEGNTH),
                    cur_page_num,
                    max_pages,
                    PAGE_LEGNTH
                )],
                components: [await getPageButtons(cur_page_num, max_pages)]
            })
        }
        else if (col.customId.endsWith('left')) {
            cur_page_num--;
            await interaction.editReply({
                embeds: [CustomEmbeds.message_tracking_module.leaderboard(
                    getPageFromArray(list_res!, cur_page_num, PAGE_LEGNTH),
                    cur_page_num,
                    max_pages,
                    PAGE_LEGNTH
                )],
                components: [await getPageButtons(cur_page_num, max_pages)]
            })
        }
    })
})