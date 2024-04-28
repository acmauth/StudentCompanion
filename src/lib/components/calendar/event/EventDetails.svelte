<script lang="ts">
    import { EventStore } from '$components/calendar/event/EventStore';
    import { EventRepeatType, EventType, type Event, type EventFlat, type EventTimeSlot } from '$components/calendar/event/Event';
	import { toastController } from '@ionic/core';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { classStore } from '$components/schedule/class/classStore';
	import { weekdays } from '$components/schedule/day/days';
	import { add } from 'ionicons/icons';

    export let eventId: number;
    let eventItem: Event | undefined; 
    $: eventItem = $EventStore.find(x => x.id == eventId);

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
        

        count = (eventItem?.slots?.length || 1);
        console.log(count);

        for(let i = 0; i < count; i++) {
            selectedOption[i] = true;
        }

        for (let i = 0; i < count; i++) {
            if (!selectedOption[i]) continue;
            startDate = new Date(eventItem?.slots[i]?.start || new Date());
            endDate = new Date(eventItem?.slots[i]?.end || new Date());
            starts.push(startDate.getFullYear() + "-" +
                    (String(startDate.getMonth() + 1)).padStart(2, '0') + "-" +
                    String(startDate.getDate()).padStart(2, '0') + "T" +
                    String(startDate.getHours()).padStart(2, '0') + ":" +
                    String(startDate.getMinutes()).padStart(2, '0'))

            ends.push(endDate.getFullYear() + "-" +
                (String(endDate.getMonth() + 1)).padStart(2, '0') + "-" +
                String(endDate.getDate()).padStart(2, '0') + "T" +
                String(endDate.getHours()).padStart(2, '0') + ":" +
                String(endDate.getMinutes()).padStart(2, '0'))
        }
    };

    function clearSelection(i: number) {
        const selection = (document.getElementById("day-" + i.toString()) as HTMLIonSelectElement);
        selection.value = null;
        selectedOption[i] = false;
        if (count > 1) count--;
    }

   
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
    {#if !noneSelected}
<!-- <form on:submit={onSubmit}> -->
    <ion-input
        placeholder="Τελειότητα 101"
        label="Τίτλος"
        label-placement="stacked"
        id="title"
        type="text"
        value={eventItem?.title}
        contenteditable="true"
        spellcheck={true}
    />

    <ion-input
        placeholder="Hogwarts campus"
        label="Αίθουσα"
        label-placement="stacked"
        id="classroom"
        type="text"
        value={eventItem?.classroom}
        contenteditable="true"
        spellcheck={true}
    />

    <ion-input
        placeholder="Κύριος Ξερώλας"
        label="Διδάσκων"
        label-placement="stacked"
        id="professor"
        type="text"
        value={eventItem?.professor}
        contenteditable="true"
        spellcheck={false}
    />

    {#each {length: count} as _, i}
        <ion-div style="display: flex; align-items: center; justify-content: center; width: 100%; padding-bottom: 0">
            <ion-select
                id="day-{i}"
                label-placement="stacked"
                interface="action-sheet"
                cancel-text="Άκυρο"
                value={eventItem && eventItem.slots[i] ? eventItem.slots[i].day : null}
                style="padding:0; margin-right: 20px;"
                placeholder="Ημέρα"
                on:ionChange={() => {selectedOption[i] = true;}}
                on:ionCancel={() => {selectedOption[i] = false; clearSelection(i);}}>
                {#each weekdays as day, j}
                    {#each Object.keys(day) as key }
                        <ion-select-option id={key} contextmenu="" value={j}>{day[key].el}</ion-select-option>
                    {/each}
                {/each}
            </ion-select>

            <ion-datetime-button datetime="start-{i}" disabled={!selectedOption[i]}></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="start-{i}" presentation="time" minute-values="0,15,30,45" hour-cycle="h23" value={starts[i]}></ion-datetime>
            </ion-modal>

            <ion-datetime-button datetime="end-{i}" disabled={!selectedOption[i]}></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="end-{i}"  presentation="time" minute-values="0,15,30,45" hour-cycle="h23" value={ends[i]}></ion-datetime>
            </ion-modal>
        </ion-div>
    {/each}

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <ion-div on:click={() => {$: count++;}} style="padding-bottom:50px;">
        <ion-icon icon={add} style="margin-right: 5px;"></ion-icon>
        <ion-div>Προσθήκη ημέρας</ion-div>
    </ion-div>
    {:else}
    <ion-label class="no-event">Δεν έχει επιλεγεί συμβάν.</ion-label>
    {/if}
</ion-content>
<!-- </form> -->


<style>
    .no-event {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center; padding-top:50px;
    }   
</style>