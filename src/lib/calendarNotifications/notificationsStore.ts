import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { get } from "svelte/store";

// Store the id of each notification
export const scheduledNotifications = new CapacitorPersistedStore<any[]>([], 'scheduledNotifications');

// get the value of the store that is the ids
export function getIds():any[]{
    let storedIds:any;
    scheduledNotifications.subscribe(ids => {
        storedIds = [...ids]; // Create a shallow copy of the array
    })
    // console.log(storedIds.length);
    // for (const array of storedIds){
    //     console.log(array.event.id);
    //     for (const id of array.notificationIds){
    //         console.log(id);  
    //     }
    //     console.log('----------------');
    // }  
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
    scheduledNotifications.update((items) => items.filter((item) => false));//item.event.id !== id
}