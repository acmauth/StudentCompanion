<script lang="ts">
    import { add, calendarClearOutline, close, checkmark } from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
    import DateSwiper from '$lib/components/calendar/DateSwiper.svelte';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import EventDetails from '$lib/components/calendar/event/EventDetails.svelte';
    import type { EventFlat } from '$lib/components/calendar/event/Event';

    let activeDate: Date;
    let eventList: EventFlat[];
    let selectedEventId: number | null = null;
    let modalOpen: boolean = false;
    
    
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
            <ion-button on:click={() => {modalOpen=true; selectedEventId=null;}} aria-hidden>
            <ion-icon slot="icon-only" icon={add}></ion-icon>  
            </ion-button>
        </ion-buttons>
        </ion-toolbar>
    </ion-header>


    <ion-content scroll-y={false}>
        <DateSwiper bind:activeDate={activeDate}/>

        <div style="height:100%;">
            {#if eventList.length > 0}
                <div class="container">
                    <ion-content>
                    {#each eventList as eventItem}
                        <EventCard eventItem={eventItem} bind:selectedEventId={selectedEventId} />
                    {/each}
                    </ion-content>
                </div>
            {:else}
                <div class="container no-events">
                    <ion-icon icon={calendarClearOutline} size="large" style="padding: 15px"></ion-icon>
                    <ion-label>Δεν υπάρχουν προγραμματισμένα συμβάντα αυτήν τη μέρα.</ion-label>
                </div>
            {/if}

        </div>

        <ion-modal 
            is-open={modalOpen} 
            initial-breakpoint={0.95} 
            breakpoints={[0, 0.95]} 
            on:ionBreakpointDidChange={(event)=>{modalOpen = event.detail.breakpoint!=0}}
            on:ionModalDidDismiss={()=>{modalOpen=false;}}    
        >
            <ion-toolbar>
                <ion-buttons slot="end">
                    <ion-button on:click={()=>{modalOpen=false;}} aria-hidden>
                        <ion-icon slot="icon-only" icon={checkmark}/>
                    </ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Συμβάν</ion-title>
                <ion-buttons slot="start">
                    <ion-button on:click={()=>{modalOpen=false;}} aria-hidden>
                        <ion-icon slot="icon-only" icon={close}/>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            <ion-content>
                <EventDetails eventId={selectedEventId} />
            </ion-content>
        </ion-modal>
    </ion-content>
</ion-tab>

<style>
    .container {
        display: flex;
        flex:1;
        height: 100%;
        flex-direction: column; 
        overflow-y: auto;
        align-items: space-around;
    }
    .no-events {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center; 
        padding-bottom: 150px;
        padding-inline: 30px;
    }
    ion-button {
        text-transform: none;
    }
</style>