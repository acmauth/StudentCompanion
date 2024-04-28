<script lang="ts">
    import { EventStore } from '$components/calendar/event/EventStore';
	import type {Event, EventTimeSlot} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType , getEventTypeValue, getEventRepeatTypeValue} from '$components/calendar/event/Event';
    import { toastController } from '@ionic/core';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { classStore } from '$components/schedule/class/classStore';
	import { weekdays } from '$components/schedule/day/days';
	import { add } from 'ionicons/icons';

    export let eventId: number | null;
    let eventItem: Event | undefined; 
    $: eventItem = $EventStore.find(x => x.id == eventId);

    let selectedType: string = Object.keys(EventType)[0];
    let willRepeat: boolean = false;
    let willRepeatUntil: boolean = false;
    let willNotify: boolean = false;

    let noneSelected: boolean = false;
    let startDate: Date;
    let endDate: Date;
    let starts: string[] = [];
    let ends: string[] = [];

    let count: number;

    let selectedOption: boolean[] = [];

   $: {
        noneSelected = !eventItem || eventItem == undefined;

        console.log(eventItem);

        noneSelected = !eventItem || typeof(eventItem) == undefined || eventItem == undefined;
        
    };
   
    // async function onSubmit(event: Event) {
    //     event.preventDefault();

    //     const title = (document.getElementById('title') as HTMLInputElement).value || "Ανώνυμο μάθημα";
    //     const classroom = (document.getElementById('classroom') as HTMLInputElement).value || "Χωρίς αίθουσα";
    //     const professor = (document.getElementById('professor') as HTMLInputElement).value || "Χωρίς διδάσκοντα";
    //     const slots: EventTimeSlot[] = [];
    //     for (let i = 0; i < count; i++) {
    //         if (!selectedOption[i]) continue;
    //         const day = (document.getElementById(`day-${i}`) as HTMLIonSelectElement).value;
    //         const startInputElement = document.getElementById(`start-${i}`) as HTMLIonDatetimeElement;
    //         const endInputElement = document.getElementById(`end-${i}`) as HTMLIonDatetimeElement;
    //         const start = new Date(startInputElement.value?.toString() || new Date().toString());
    //         const end = new Date(endInputElement.value?.toString() || new Date().toString());

    //         if (start >= end) {
    //             await toastController.create({message: "Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης.", duration: 2000, color: 'tertiary' , mode: 'ios', translucent: true, cssClass: 'toast-center'})
    //                 .then(toast => toast.present());
    //         return;
    //         } else slots.push({ day:day, startTime: start, endTime:end });
    //     }

    //     let formData: Event = {
    //         id: eventItem?.id ||new Date().getTime(),
    //         title,
    //         location: classroom,
    //         description: "Χωρίς περιγραφή",
    //         professor,
    //         type: EventType.CLASS,
    //         repeat: EventRepeatType.NONE,
    //         repeatInterval: 0,
    //         repeatUntil: null,
    //         notify: false,
    //         notifyTime: 0,
    //         slots
    //     };



    //     classStore.update(oldArray => {
    //         // Find the index of the item with the specified id
    //         const index = oldArray.findIndex(item => item.id === eventItem?.id);

    //         // If the item is found, update its value
    //         if (index !== -1) {
    //             oldArray[index] = formData;
    //         }
    //         return [...oldArray];
    //     });

    //     goto('/pages/schedule');
    // }

</script>

<ion-content force-overscroll>
    <ion-list>
        
        <ion-item>
            <ion-input
            label="Τίτλος"
            label-placement="floating"
            id="title"
            type="text"
            value={eventItem?.title || null}
            contenteditable="true"
            spellcheck={true}
        />
        </ion-item>

        <ion-item>
            <ion-select label="Τύπος συμβάντος" interface="popover" value={selectedType} on:ionChange={(event)=>selectedType=event.detail.value} label-placement="floating">
                {#each Object.values(EventType) as type}
                    <ion-select-option value={type}>{getEventTypeValue(type,'el')}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if selectedType == "CLASS"}
            <ion-item>
                <ion-input
                    label="Αίθουσα"
                    label-placement="floating"
                    id="classroom"
                    type="text"
                    value={eventItem?.location || null}
                    contenteditable="true"
                    spellcheck={true}
                />
            </ion-item>
            <ion-item>
                <ion-input
                    label="Διδάσκων"
                    label-placement="floating"
                    id="professor"
                    type="text"
                    value={eventItem?.professor || null}
                    contenteditable="true"
                    spellcheck={false}
                />
            </ion-item>
        {/if}

        <ion-item>
            <ion-input
                label="Περιγραφή"
                label-placement="floating"
                id="description"
                type="text"
                value={eventItem?.description || null}
                contenteditable="true"
                spellcheck={true}
            />
        </ion-item>
        
        <ion-item>
            <ion-select style="width:50%;" label="Να επαναλαμβάνεται" interface="popover" value={"NEVER"} on:ionChange={(event)=>{willRepeat=event.detail.value != "NEVER";}} label-placement="floating">
                {#each Object.values(EventRepeatType) as type}
                    <ion-select-option value={type}>{getEventRepeatTypeValue(type,'el')}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if willRepeat}
            <ion-item>
                <ion-select style="width:80%;" label="Λήξη" interface="popover" value={"REPEAT"} on:ionChange={(event)=>{willRepeatUntil=event.detail.value == "UNTIL";}} label-placement="floating">
                    <ion-select-option value="REPEAT">Επαναλήψεις</ion-select-option>
                    <ion-select-option value="UNTIL">Ημερομηνία</ion-select-option>
                </ion-select>

                <div style="padding-inline:10px;"/>

                {#if willRepeatUntil}
                    <ion-datetime-button style="width: fit-content;" datetime="start"></ion-datetime-button>
                    <ion-modal keep-contents-mounted={true}>
                        <ion-datetime id="start" presentation="date-time" minute-values="0,15,30,45" hour-cycle="h23"></ion-datetime>
                    </ion-modal>
                {:else}
                    <ion-input
                        label="Φορές"
                        label-placement="floating"
                        id="repeatInterval"
                        type="number"
                        value={eventItem?.repeatInterval || null}
                        contenteditable="true"
                        spellcheck={false}
                        style="width: 30%;"    
                    />
                {/if}
            </ion-item>
        {/if}

        <ion-item>
            <ion-select style="width:50%;" label="Ειδοποίηση" interface="popover" value={false} on:ionChange={(event)=>{willNotify=event.detail.value;}} label-placement="floating">
                <ion-select-option value={true}>Ναι</ion-select-option>
                <ion-select-option value={false}>Όχι</ion-select-option>
            </ion-select>
            {#if willNotify}
                <div style="padding-inline:10px;"/>
                <ion-input
                    label="Πριν από (λεπτά)"
                    label-placement="floating"
                    id="notifyTime"
                    type="number"
                    value={eventItem?.notifyTime || null}
                    contenteditable="true"
                    spellcheck={false}   
                    style="width: 50%;"
                />
            {/if}    
        </ion-item>

        
    </ion-list>
</ion-content>


<style>

</style>