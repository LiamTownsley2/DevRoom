import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Button, ButtonExec } from "../types/buttons";
import { CustomEmojis } from '../config/embeds';

/**
 * Button Outline
 * @param id The Custom ID of the button.
 * @param exec The button execution object
 * @returns Button
 */
export function button(id: string, exec: ButtonExec): Button {
    return {
        id,
        exec
    }
}

/**
 * Get the buttons to allow a user to select a different page on an embed.
 * @module utils
 * @param page_number The current page number
 * @param pages_max The maximum amount of pages
 * @returns Promise<ActionRowBuilder<ButtonBuilder>>
 */
export async function getPageButtons(page_number: number, pages_max: number) {
    const _left = new ButtonBuilder()
        .setCustomId(`page_button:left`)
        .setEmoji(CustomEmojis.left_chevron)
        .setLabel('Previous Page')
        .setDisabled(page_number == 1)
        .setStyle(ButtonStyle.Secondary)
    const curNumber = new ButtonBuilder()
        .setCustomId('page_number')
        .setLabel(`${page_number} / ${pages_max}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    const _right = new ButtonBuilder()
        .setCustomId(`page_button:right`)
        .setEmoji(CustomEmojis.right_chevron)
        .setLabel('Next Page')
        .setDisabled((page_number + 1) > pages_max)
        .setStyle(ButtonStyle.Secondary)


    return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(_left, curNumber, _right);
}