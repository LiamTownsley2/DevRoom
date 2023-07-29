import { Awaitable, ButtonInteraction } from "discord.js";
import CustomClient from "../client/CustomClient";

export interface Button {
    id: string
    exec: ButtonExec
}
export interface ButtonProps {
    interaction: ButtonInteraction
    client: CustomClient
}
export type ButtonExec =
    (props: ButtonProps) => Awaitable<unknown>
