import keys from '../keys';
import events from '../events';
import { connectToDatabase } from '../services/database';
import CustomClient from './CustomClient';
import { registerEvents } from '../utils';
const _customClient = new CustomClient();

/**
* This function will initilise the bot and connect it to all of the relevant services.
* @return void
*/
async function start() {
    console.log('[client]', 'Attempting connection to Database.')
    await connectToDatabase();

    console.log('[client]', 'Attempting to register events.')
    registerEvents(_customClient, events);

    console.log('[client]', 'Attempting to login to Discord using token provided.')
    _customClient.login(keys.DISCORD_TOKEN)
        .then(() => {
            console.log('[client]', 'Sucesfully logged into Discord.')
        })
        .catch(err => {
            console.log('[client]', 'Error logging into Discord.')
            console.error(err)
            process.exit(1);
        });
}

(async () => {
    await start();
})();