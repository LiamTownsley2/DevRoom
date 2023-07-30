import { Client, GatewayIntentBits } from "discord.js";

/**
* An extended DiscordJS.Client.
*/
export default class CustomClient extends Client<true> {

    /**
    * Custom Client constructor.
    */
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    /**
    * Function is used to output messages to console and keep them organised.
    *
    * @param id the ID will be prepended to the log.
    * @param args Message you want to output to the console.
    * @returns void
    */
    public async log(id: string, ...args: any[]) {
        console.log(`[${id}]`, ...args);
    }
}