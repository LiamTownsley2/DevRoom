import CustomClient from "../client/CustomClient";
import { Event, EventExec, EventKeys } from "../types";

export function event<T extends EventKeys>(id: T, exec: EventExec<T>): Event<T> {
    return {
        id,
        exec
    }
}

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