import { AutocompleteInteraction, Awaitable, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import CustomClient from "../client/CustomClient";
import { GuildConfig } from ".";


export interface CommandProps {
    interaction: ChatInputCommandInteraction
    client: CustomClient
    config: GuildConfig
}

export type CommandExec =
    (props: CommandProps) => Awaitable<unknown>

export interface AutocompleteProps {
    interaction: AutocompleteInteraction
    client: CustomClient
}

export type CommandAutocomplete =
    (props: AutocompleteProps) => Awaitable<unknown>

export type CommandMeta = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandGroupBuilder | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">

export interface Command {
    meta: CommandMeta
    exec: CommandExec
    guild_only?: boolean
}

export interface AutoCompleteCommand extends Command {
    meta: CommandMeta
    exec: CommandExec
    autocomplete?: CommandAutocomplete
    guild_only?: boolean
}

export interface CommandCategoryExtra {
    description?: string
    emoji?: string

}

export interface CommandCategory extends CommandCategoryExtra {
    name: string
    commands: Command[]
} 
