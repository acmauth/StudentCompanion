<script lang="ts">
    import { add, bookOutline } from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
    import DateSwiper from '$lib/components/calendar/DateSwiper.svelte';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import { EventRepeatType, EventType, type Event, type EventFlat } from '$lib/components/calendar/event/Event';
    import EventDetails from '$lib/components/calendar/event/EventDetails.svelte';
	import { TaskType, type TaskItem } from '$components/schedule/task/TaskItem';
    
    let activeDate: Date;
    let eventList: EventFlat[];
    let selectedEventId: number;
    
    
    $: eventList = $EventStore.flatMap(item =>
        item.slots.map(slot => ({
            id: item.id,
            title: item.title,
            professor: item.professor,
            classroom: item.location,
            description: item.description,
            type: item.type,
            repeat: item.repeat,
            repeatInterval: item.repeatInterval,
            repeatUntil: item.repeatUntil,
            notify: item.notify,
            notifyTime: item.notifyTime,
            slot: slot
        }))).filter(item => isCurrentDay(item.slot.start, activeDate));//.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    function isCurrentDay(date1: Date, current: Date): boolean {
        const currentDate = new Date(current);
        const date = new Date(date1);
        return (
            date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getDate() === currentDate.getDate()
        );
}
</script>

<ion-tab tab="calendar">
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
        <ion-title class="ion-padding-vertical" size="large" style="padding-top:0; padding-bottom:0;">Πρόγραμμα μαθημάτων</ion-title>
        <ion-buttons slot="secondary">
            <ion-button href="/pages/classes/addClass">
            <ion-icon slot="icon-only" icon={add}></ion-icon>  
            </ion-button>
        </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <div>
        <DateSwiper bind:activeDate={activeDate}/>
    </div>

    <ion-grid>
        <ion-row class="calendar">
            <ion-content>
                {#each eventList as eventItem}
                    <EventCard eventItem={eventItem} bind:selectedEventId={selectedEventId} />
                {/each}
            </ion-content>
        </ion-row>
        <ion-row class="custom-center-label">
            {#if eventList.length === 0}
                <ion-icon icon={bookOutline} size="large" style="padding: 15px"></ion-icon>
                <ion-label>Δεν υπάρχουν προγραμματισμένα μαθήματα αυτή τη μέρα.</ion-label>
            {:else}
                <div style="height: 5rem;"/>
            {/if}
        </ion-row>
        <ion-row>
            <ion-content force-overscroll style="overflow-y:scroll;">
                <EventDetails eventId={selectedEventId} />
            </ion-content>
        </ion-row>
    </ion-grid>
</ion-tab>

<style>
    .custom-center-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
    }

    ion-button {
        text-transform: none;
    }
    
    ion-grid {
        height: 100%;
        margin-inline: 0px;
        padding-inline: 0;
        padding-block: 5px;
    }
    
    ion-row {
        height: 60%;
    }

    .event-details {
        overflow-y: scroll;
        padding-top: 10px;
        padding-bottom:30px;
        /* margin-top: 10px; */
        border-top: 5px solid var(--ion-color-light);   
        /* background-color: var(--ion-color-light); */
    }
</style>