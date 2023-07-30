import CustomClient from "../client/CustomClient";
import keys from "../keys";
import { AutoCompleteCommand, Command, CommandAutocomplete, CommandCategory, CommandCategoryExtra, CommandExec, CommandMeta } from "../types";

export function command(meta: CommandMeta, exec: CommandExec, autocomplete?: CommandAutocomplete, guild_only:boolean = false): Command | AutoCompleteCommand {
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

export function category(name: string, commands: Command[], extra: CommandCategoryExtra = {}): CommandCategory {
    return {
        name,
        commands,
        ...extra
    }
}

export async function getCommandReference(command_name: string, client: CustomClient) {
    let _command = client.application?.commands.cache.find(x => x.name == command_name);
    if (!_command) _command = (await client.application?.commands.fetch(undefined)!).find(x => x.name == command_name);
    if (!_command) _command = (await client.application?.commands.fetch(undefined, { guildId: keys.MAIN_GUILD_ID })!).find(x => x.name == command_name);

    if (!_command) return `/${command_name}`;
    return `</${_command.name}:${_command.id}>`;
}

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
