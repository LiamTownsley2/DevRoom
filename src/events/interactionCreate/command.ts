import commands from "../../commands";
import keys from "../../keys";
import { getGuildConfig } from "../../services";
import { Command } from "../../types"
import { event } from "../../utils";

const allCommands = commands.map(({ commands }) => commands).flat()
const allCommandsMap = new Map<string, Command>(
    allCommands.map((c) => [c.meta.name, c])
)


export default event('interactionCreate', async ({ client }, interaction) => {
    if (!interaction.isChatInputCommand()) return
    if(!interaction.guild) return;

    try {
        const commandName = interaction.commandName
        const command = allCommandsMap.get(commandName)
        if(command?.guild_only && interaction.guildId !== keys.MAIN_GUILD_ID) return; 

        if (!command) throw new Error('Command not found.')

        const config = await getGuildConfig(interaction.guild.id);

        await command.exec({
            client,
            interaction,
            config
        });

        client.log('execution', `${interaction.user.tag} (${interaction.user.id}) has used ${interaction.commandName} in channel: ${interaction.channel?.id}`)
    } catch (error) {
        client.log(`error | cmd: ${interaction?.commandName}`, error)
        if (interaction.deferred || interaction.replied) {
            return interaction.editReply({
                content: 'There was an eror running this command.'
            })
        }
        return interaction.reply({
            ephemeral: true,
            content: 'There was an eror running this command.'
        })
    }
})