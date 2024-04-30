<script lang="ts">
    import { add, calendarClearOutline, close, checkmark } from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
    import DateSwiper from '$lib/components/calendar/DateSwiper.svelte';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import EventDetails from '$lib/components/calendar/event/EventDetails.svelte';
    import type { Event } from '$lib/components/calendar/event/Event';
    import { EventType, EventRepeatType } from '$lib/components/calendar/event/Event';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';

    let activeDate: Date;
    let eventList: Event[];
    let selectedEvent: Event | null = null;
    let tmpEvent: Event | null = null;
    let modalOpen: boolean = false;
    let willRepeatType: string | null = null;
    
    $EventStore = [{ id: 1,
    title: "Study Group Meeting",
    slot: 
        {
            start: new Date("2024-04-30T10:00:00"),
            end: new Date("2024-04-30T12:00:00")
        }
    ,
    location: "Library",
    description: "Discussing upcoming exam topics",
    professor: "Dr. Smith",
    type: EventType.CLASS,
    repeat: EventRepeatType.WEEKLY,
    repeatInterval: 1,
    repeatUntil: new Date("2024-06-01"),
    notify: true,
    notifyTime: 30}]
    
    
    $: eventList = $EventStore.filter(item => isCurrentDay(item.slot.start, activeDate));//.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    function isCurrentDay(date1: Date, current: Date): boolean {
        const currentDate = new Date(current);
        const date = new Date(date1);
        return (
            date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getDate() === currentDate.getDate()
        );
    }

    // TODO: take the tmpEvent object and check if it has the correct format then replace the selectedEvent with the tmpEvent in the store
    // remebmer to update the filtering for the calculation of the timeslots based on the repeat type
    function sumbit() {
        if(tmpEvent?.id == selectedEvent?.id) {
            if(!eventHasCorrectFormat(tmpEvent)) {
                showToast({
						color: 'warning',
						duration: 3000,
						message: 'Τσέκαρε τα στοιχεία του συμβάντος!',
						mode: 'ios',
						translucent: true,
						layout: 'stacked',
						positionAnchor: "bottom",
						cssClass: 'custom-toast'
					});
                return;
            }            
            const index = $EventStore.findIndex(x => x.id == tmpEvent?.id);
            
            if(index != -1 && tmpEvent!=null) {
                $EventStore[index] = tmpEvent;
            } else if (tmpEvent!=null) {
                $EventStore = [...$EventStore, tmpEvent];
            }
            selectedEvent = null;
            tmpEvent = null;
            modalOpen = false;
        } else {
            modalOpen=false;
        }
    }    

	async function showToast(toast: ToastOptions){
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

    function eventHasCorrectFormat(event: Event | null): boolean {
        return (event!=null && event.title != undefined && event.title.length > 0 && new Date(event.slot.start).getTime() <= new Date(event.slot.end).getTime());
    }

    function setupModal() {
        if(selectedEvent == null) {
            if(!tmpEvent) {
                tmpEvent = {
                    id: new Date().getTime(),
                    title: "",
                    slot: {
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000)
                    },
                    type: EventType.TASK,
                    location: "",
                    description: "",
                    professor: "",
                    repeatInterval: 1,
                    repeatUntil: null,
                    notifyTime: 30,
                    repeat: EventRepeatType.NEVER,
                    notify: false
                }
            }
        } else {
            tmpEvent = JSON.parse(JSON.stringify(selectedEvent));
            if (tmpEvent) {
                tmpEvent.slot.start = new Date(selectedEvent?.slot.start);
                tmpEvent.slot.end = new Date(selectedEvent?.slot.end);
            }
        }
    }

</script>

<ion-tab tab="calendar">
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
        <ion-title class="ion-padding-vertical" size="large" style="padding-top:0; padding-bottom:0;">Πρόγραμμα μαθημάτων</ion-title>
        <ion-buttons slot="secondary">
            <ion-button on:click={() => {modalOpen=true; selectedEvent=null;}} aria-hidden>
            <ion-icon slot="icon-only" icon={add}></ion-icon>  
            </ion-button>
        </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <DateSwiper bind:activeDate={activeDate}/>

    <ion-content scroll-y={true}>

        <div style="height:100%;">
            {#if eventList.length > 0}
                <div class="container">
                    <ion-content>
                    {#each eventList as eventItem}
                        <EventCard eventItem={eventItem} bind:selectedEvent={selectedEvent} bind:modalOpen={modalOpen} />
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
            initial-breakpoint={selectedEvent? 0.95 : 1} 
            breakpoints={[0, 0.95, 1]} 
            on:ionBreakpointDidChange={(event)=>{modalOpen = event.detail.breakpoint!=0; if(!modalOpen) selectedEvent=null;}}
            on:ionModalDidDismiss={()=>{modalOpen=false; selectedEvent=null; tmpEvent=null; willRepeatType=null;}}
            on:ionModalWillPresent={()=>{setupModal(); modalOpen=true;}}    
        >
            <ion-toolbar>
                <ion-buttons slot="end">
                    <ion-button id="sumbit" on:click={sumbit} aria-hidden>
                        <ion-icon slot="icon-only" icon={checkmark}/>
                    </ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">{selectedEvent?.title? selectedEvent.title : 'Συμβάν'}</ion-title>
                <ion-buttons slot="start">
                    <ion-button id="cancel" on:click={()=>{modalOpen=false;}} aria-hidden>
                        <ion-icon slot="icon-only" icon={close}/>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
                <EventDetails bind:copyEvent={tmpEvent} />
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