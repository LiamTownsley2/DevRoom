import CustomClient from "../client/CustomClient";
import { Event, EventExec, EventKeys } from "../types";

/**
 * Event Outline
 * @param id The ID of the event
 * @param exec The Execution Object of the event.
 * @returns Event<T>
 */
export function event<T extends EventKeys>(id: T, exec: EventExec<T>): Event<T> {
    return {
        id,
        exec
    }
}

/**
 * Register the commands and allow the bot to handle the event appropriately.
 * @param client The CustomClient object.
 * @param events The events that need to be registered.
 * @returns void
 */
export function registerEvents(client: CustomClient, events: Event<any>[]): void {
    for (const event of events)
        client.on(event.id, async (...args) => {

            try {
                await event.exec({ client }, ...args)
            } catch (error) {
                client.log('Unhandled Error', error)
            }
        });
}