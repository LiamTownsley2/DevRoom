import { Client, GatewayIntentBits } from "discord.js";
import { getConfigFromDatabase } from "../services/database";
import keys from "../keys";
import { IConfig } from "../types/config";

export default class CustomClient<Ready extends boolean = boolean> extends Client<Ready> {
    public config: IConfig | undefined;
    private _lastFetchedConfig: number;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
            ],
        });
        this.config = undefined;
        this._lastFetchedConfig = 0;
    }

    
    // public get ready() : boolean {
    //     return 
    // }
    

    public async getConfig(): Promise<IConfig | undefined> {
        const TWO_MINUTES = 120000;
        if (this.config == undefined) {
            const config = await getConfigFromDatabase(keys.GUILD_ID);
            this._lastFetchedConfig = +new Date();
            this.config = config;
        } else if ((+new Date() - this._lastFetchedConfig) >= TWO_MINUTES) {
            const config = await getConfigFromDatabase(keys.GUILD_ID);
            this._lastFetchedConfig = +new Date();
            this.config = config;
        }

        return this.config;
    }

    public async log(id:string, ...args:any[]) {
        console.log(`[${id}]`, ...args);
    }
}