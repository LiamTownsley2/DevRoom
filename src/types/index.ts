import { ActivityType } from 'discord.js';

export * from './commands';
export * from './config';
export * from './keys';
export * from './events';
export * from './buttons';

export type RestrictedActivityType = ActivityType.Playing | ActivityType.Streaming | ActivityType.Listening | ActivityType.Watching | ActivityType.Competing | undefined;