import CustomClient from "../client/CustomClient";
import keys from "../keys";
import { AutoCompleteCommand, Command, CommandAutocomplete, CommandCategory, CommandCategoryExtra, CommandExec, CommandMeta } from "../types";

/**
 * Command Outline
 * @param meta Command Meta Data
 * @param exec Command Execution Object
 * @param autocomplete Autocomplete Execution Object
 * @param guild_only If true this command will only work within the guild specified within the .env file.
 * @returns Command | AutoCompleteCommand
 */
export function command(meta: CommandMeta, exec: CommandExec, autocomplete?: CommandAutocomplete, guild_only: boolean = false): Command | AutoCompleteCommand {
    if (autocomplete) {
        return {
            meta,
            exec,
            autocomplete,
            guild_only
        }
    }

    return {
        meta,
        exec,
        guild_only
    }
}

/**
 * Category Outline
 * @param name Command Category Name
 * @param commands List of Commands within the category
 * @param extra Additional info
 * @returns CommandCategory
 */
export function category(name: string, commands: Command[], extra: CommandCategoryExtra = {}): CommandCategory {
    return {
        name,
        commands,
        ...extra
    }
}

/**
 * Get a Discord Command Reference as a string.
 * @param command_name The name of the command
 * @param subcommand The subcommand of the command you want to mention
 * @param client The CustomClient object.
 * @returns Promise<string>
 */
export async function getCommandReference(command_name: string, subcommand: string | undefined, client: CustomClient) {
    let _command = client.application?.commands.cache.find(x => x.name.startsWith(command_name));
    if (!_command) _command = (await client.application?.commands.fetch(undefined)!).find(x => x.name.startsWith(command_name));
    if (!_command) _command = (await client.application?.commands.fetch(undefined, { guildId: keys.MAIN_GUILD_ID })!).find(x => x.name.startsWith(command_name));

    if (!_command) return `/${command_name}`;
    return `</${_command.name}${(subcommand) ? ` ${subcommand}` : ''}:${_command.id}>`;
}

/**
 * Get all deployed commands as Command References
 * @param client The CustomClient object.
 * @return Promise<{ name: string, ref: string }[] | undefined>
 */
export async function getAllCommandReferences(client: CustomClient): Promise<{ name: string, ref: string }[] | undefined> {
    let _command = client.application?.commands.cache;
    if (_command?.size == 0) _command = await client.application?.commands.fetch(undefined, { force: true });
    if (!_command) return undefined;

    let _references = [];
    for (const command of _command) {
        _references.push({ name: command[1].name, ref: `</${(command[1].name == 'config') ? 'config add' : command[1].name}:${command[0]}>` })
    }

    return _references;
}

/**
 * Splice an array to get the information for a specified page.
 * @param array The array you want to use
 * @param pageNumber The page number you want to get
 * @param pageSize How big are the pages?
 * @returns any[]
 */
export function getPageFromArray(array: any[], pageNumber: number, pageSize: number) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return array.slice(startIndex, endIndex > array.length ? array.length : endIndex);
}