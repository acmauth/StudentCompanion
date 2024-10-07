import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { get } from "svelte/store";

// stores objects with properties event: Event, notificationIds: number[], lastNotification: Date
export const scheduledNotifications = new CapacitorPersistedStore<any[]>([], 'scheduledNotifications');

// get the value of the store
export function getIds():any[]{
    let storedIds:any[] = [];
    scheduledNotifications.subscribe(ids => {
        storedIds = [...ids]; // Create a shallow copy of the array
    });
    return storedIds;
}

//Adding the ids of the new notifications
export function addToScheduledNotifications(newIds: any){
    get(scheduledNotifications);
    scheduledNotifications.update(ids => [...ids, newIds]);
}

// Removing the ids of some notifications
export function removeFromScheduledNotficiations(id: number){
    get(scheduledNotifications);
    scheduledNotifications.update((items) => items.filter((item) => item.event.id !== id));
}