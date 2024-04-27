import type { Event } from "./Event";
import CapacitorPersistedStore from "$lib/storage/capacitorPersistedStore";

export const EventStore = new CapacitorPersistedStore(new Array<Event>(), 'EventStore');