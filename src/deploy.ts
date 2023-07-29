import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, '..', '.env') })

// Suppress Experimental stream/web warning.
process.removeAllListeners('warning');

import { REST, Routes, APIUser } from "discord.js";
import commands from "./commands";
import keys from "./keys";

const body_global = commands.map(({ commands }) =>
    commands.filter(x => !x.guild_only).map(({ meta }) =>
        meta)).flat();

const body_guild = commands.map(({ commands }) =>
    commands.filter(x => x.guild_only).map(({ meta }) =>
        meta)).flat();

const rest = new REST({ version: '10' }).setToken(keys.DISCORD_TOKEN)


async function main() {
    const currentUser = await rest.get(Routes.user()) as APIUser
    const global_endpoint = Routes.applicationCommands(keys.CLIENT_ID)
    const guild_endpoint = Routes.applicationGuildCommands(keys.CLIENT_ID, keys.MAIN_GUILD_ID)
    if (process.env.NODE_ENV == 'production') {
        await rest.put(global_endpoint, { body: [...body_global] });
        await rest.put(guild_endpoint, { body: [...body_guild] });
    } else {
        await rest.put(guild_endpoint, { body: [...body_guild, ...body_global] });
    }

    return currentUser
}


main()
    .then((user) => {
        const tag = `${user.username}#${user.discriminator} (${user.id})`
        const response = process.env.NODE_ENV == 'production'
            ? `Sucesfully released commands globally as ${tag}.`
            : `Sucesfully assigned commands locally to development guild ${keys.MAIN_GUILD_ID} as ${tag}.`

        console.log(response);
    })
    .catch()