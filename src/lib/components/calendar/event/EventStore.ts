import type { Event } from "./Event";
import CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";
import { Events } from "leaflet";

export const EventStore = new CapacitorPersistedStore(new Array<Event>(), 'EventStore');

export function getEvents():Array<Event>{
    let storedEvents = new Array<Event>;
    EventStore.subscribe(events => {
        storedEvents = [...events]; // Create a shallow copy of the array
    });
    return storedEvents;
}