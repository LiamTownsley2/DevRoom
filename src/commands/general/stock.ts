import { Collection, SlashCommandBuilder, AttachmentBuilder } from 'discord.js'
import { command } from '../../utils'
import axios from 'axios';
import { CustomEmbeds } from '../../config/embeds';
import { StockChartScales, StockChartType } from '../../types';
import keys from '../../keys';

const meta = new SlashCommandBuilder()
    .setName('stock')
    .setDescription('The bot will reply with whatever you tell it to say.')
    .addStringOption((opt) => opt
        .setName('symbol')
        .setDescription('The name of the equity of your choice. For example: IBM, TSLA')
        .setRequired(true)
    )
    .addStringOption((opt) => opt
        .setName('timescale')
        .setDescription('The scale you want the graph to be based on')
        .addChoices(
            { name: 'Intraday', value: 'intraday' },
            { name: 'Daily', value: 'daily' },
            { name: 'Weekly', value: 'weekly' },
            { name: 'Monthly', value: 'monthly' },
        )
        .setRequired(true)
    )
    .addStringOption((opt) => opt
        .setName('type')
        .setDescription('The type of data you would like to view.')
        .addChoices(
            { name: 'Open', value: 'open' },
            { name: 'High', value: 'high' },
            { name: 'Low', value: 'low' },
            { name: 'Close', value: 'close' },
            { name: 'Volume', value: 'volume' },
        )
        .setRequired(true)
    )

export default command(meta, async ({ interaction, client }) => {
    await interaction.deferReply({ ephemeral: true })
    const symbol = interaction.options.getString('symbol', true);
    const type = interaction.options.getString('type', true) as StockChartType;
    const timescale = interaction.options.getString('timescale', true) as StockChartScales;

    const chartImage = await getChartData(symbol, type, timescale);
    if(!chartImage) {
        return interaction.editReply({
            embeds: [CustomEmbeds.modules.stock.stock_invalid()]
        })
    }
    return interaction.editReply({
        embeds: [CustomEmbeds.modules.stock.stock_vaild(symbol, type)],
        files: [new AttachmentBuilder(chartImage).setName('stock.png')]
    });
})

const RESPONSE_CACHE = new Collection<string, any>();
const CHART_CACHE = new Collection<string, Buffer>();

async function getChartData(symbol: string, type: StockChartType, timescale: StockChartScales): Promise<Buffer | undefined> {
    try {
        const type_list: { [key: string]: string } = {
            'open': '1. open',
            'high': '2. high',
            'low': '3. low',
            'close': '4. close',
            'volume': '5. volume'
        }

        if (!RESPONSE_CACHE.has(symbol)) {
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=TIME_SERIES_${timescale.toUpperCase()}&symbol=${symbol}&interval=60min&apikey=${keys.ALPHAVANTAGE_KEY}`
            );
            
            let series = (timescale == 'intraday') ? '60min' : (timescale == 'daily') ? 'Daily' : (timescale == 'weekly') ? 'Weekly' : (timescale == 'monthly') ? 'Monthly' : undefined;
            const data = response.data[`Time Series (${series})`];
            console.log(data);
            if(!data) return undefined;
            RESPONSE_CACHE.set(symbol, data);
        }

        const data = RESPONSE_CACHE.get(symbol);

        const dates = Object.keys(data).reverse().filter((_, i) => {
            return i % 3 === 0;
        });
        const prices = dates.map((date) => parseFloat(data[date][type_list[type]]));

        if (!CHART_CACHE.has(`${symbol}-${type}`)) {
            const chartURL = `https://quickchart.io/chart?c={type:'line',data:{labels:[${dates.map((date) => `'${date}'`)}],datasets:[{label:'${type.toUpperCase()}',data:[${prices}],backgroundColor:'rgba(75, 192, 192, 0.2)',borderColor:'rgba(75, 192, 192, 1)',borderWidth:1}],options: {scales: {x: {ticks: {color: 'white',},},y: {ticks: {color: 'white',},},},plugins: {legend: {labels: {color: 'white',},},},}}}`;
            const image = await axios.get<Buffer>(
                chartURL,
                { responseType: 'arraybuffer' }
            )
            CHART_CACHE.set(`${symbol}-${type}`, image.data);
        }

        return CHART_CACHE.get(`${symbol}-${type}`)!;

    } catch (error) {
        throw new Error('Error fetching data from AlphaVantage API.');
    }
}