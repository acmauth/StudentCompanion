import type { Event } from "./event";
import CapacitorPersistedStore from "$services/storage/persisted/CapacitorPersistedStore";

export const EventStore = new CapacitorPersistedStore(new Array<Event>(), 'EventStore');
EventStore.loadFromStorage();

export function getEvents():Array<Event>{
    let storedEvents = new Array<Event>;
    EventStore.subscribe(events => {
        storedEvents = [...events]; // Create a shallow copy of the array
    });
    return storedEvents;
}