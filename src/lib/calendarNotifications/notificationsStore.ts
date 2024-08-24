import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { get } from "svelte/store";

// Store for the last scheduled repeated notification from each event
export const scheduledNotifications = new CapacitorPersistedStore<any[]>([], 'scheduledNotifications');

export function getIds():any[]{
    let storedIds:any;
    scheduledNotifications.subscribe(ids => {
        storedIds = [...ids]; // Create a shallow copy of the array
    })
    // console.log(storedIds.length);
    // for (const array of storedIds){
    //     console.log(array.eventId);
    //     console.log(array.repeats);
    //     for (const id of array.notificationIds){
    //         console.log(id);  
    //     }
    //     console.log('----------------');
    // }  
    return storedIds;
}

//Adding the exam to the dismissed items
export function addToScheduledNotifications(newIds: any){
    get(scheduledNotifications);
    scheduledNotifications.update(ids => [...ids, newIds]);
}

// Removing the exam from the dismissed items
export function removeFromScheduledNotficiations(id: number){
    get(scheduledNotifications);
    scheduledNotifications.update((items) => items.filter((item) => item.eventId !== id));
}