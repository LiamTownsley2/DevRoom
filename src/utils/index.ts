export * from './commands';
export * from './events';
export * from './buttons';
export * from './questions';

export function convertTimeString(timestring: string) {
    const timesplit = timestring.split(' ');
    let final_time = 0;
    for (const time of timesplit) {
        const number = parseInt(time.replace(/\D/g, ''));

        if (time.endsWith('M')) final_time += 2_630_000 * number;
        if (time.endsWith('W')) final_time += 604_800 * number;
        if (time.endsWith('w')) final_time += 604_800 * number;
        if (time.endsWith('d')) final_time += 86400 * number;
        if (time.endsWith('h')) final_time += 3600 * number;
        if (time.endsWith('m')) final_time += 60 * number;
        if (time.endsWith('s')) final_time += 1 * number;
    }
    return final_time;
}