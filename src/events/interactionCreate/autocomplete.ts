import commands from "../../commands";
import { AutoCompleteCommand, Command } from "../../types"
import { event } from "../../utils";

const allCommands = commands.map(({ commands }) => commands).flat()
const allCommandsMap = new Map<string, Command>(
    allCommands.map((c) => [c.meta.name, c])
)
export default event('interactionCreate', async ({ client }, interaction) => {
    if (!interaction.isAutocomplete()) return;
    
    try {
        const commandName = interaction.commandName
        const command = allCommandsMap.get(commandName) as AutoCompleteCommand
        if (!command) throw new Error('Autocomplete not found.')
        if (!command.autocomplete) return;

        command.autocomplete({ interaction, client });
    } catch (error) {
        client.log(`Autocomplete Error | ${interaction.commandId}`, error)
    }
})