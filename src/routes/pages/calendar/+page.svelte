<script lang="ts">
    import { add, calendarClearOutline, close, checkmark } from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
    import DateSwiper from '$lib/components/calendar/DateSwiper.svelte';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import EventDetails from '$lib/components/calendar/event/EventDetails.svelte';
    import type { Event } from '$lib/components/calendar/event/Event';
    import { eventHasCorrectFormat } from '$lib/components/calendar/event/Event';
    import { isCurrentDay } from '$lib/components/calendar/CalendarFunctions';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';


    let activeDate: Date;
    let eventList: Event[];
    let selectedEvent: Event | null = null;
    let tmpEvent: Event;
    let modalOpen: boolean = false;
    let deleteModalOpen: boolean = false;
    let dialog: HTMLDialogElement;

    {
    // $EventStore = [{ id: 1,
    // title: "Study Group Meeting",
    // slot: 
    //     {
    //         start: new Date("2024-05-17T10:00:00"),
    //         end: new Date("2024-05-17T12:00:00")
    //     }
    // ,
    // location: "Library",
    // description: "Discussing upcoming exam topics",
    // professor: "Dr. Smith",
    // type: EventType.CLASS,
    // repeat: EventRepeatType.DAILY,
    // repeatInterval: 2,
    // repeatUntil: new Date("2027-01-01T23:59:59"),
    // notify: true,
    // notifyTime: 30}];

    // To clear the EventStore, uncomment the line below
    // $EventStore = [];
    }

    $: eventList = $EventStore.filter(item => isCurrentDay(item, activeDate)).sort((a, b) => a.slot.start.getTime() < b.slot.start.getTime() ? -1 : 1);
    $: console.log(eventList);
    
    function sumbit() {
        if(!eventHasCorrectFormat(tmpEvent)) {
            showToast({
                    color: 'danger',
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

        const index = $EventStore.findIndex(x => x.id == tmpEvent.id);

        if(index != -1 && tmpEvent !== undefined) {
            $EventStore[index] = tmpEvent;
        } else if (tmpEvent !== undefined) {
            $EventStore = $EventStore.concat(tmpEvent);
        }
        selectedEvent = null;
        tmpEvent = {} as Event;
        modalOpen = false;
    }    

	async function showToast(toast: ToastOptions){
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

    function setupModal() {
        if(selectedEvent !== null) {
            tmpEvent = JSON.parse(JSON.stringify(selectedEvent));
            if (tmpEvent) {
                tmpEvent.slot.start = new Date(selectedEvent?.slot.start);
                tmpEvent.slot.end = new Date(selectedEvent?.slot.end);
            }
        }
        modalOpen = true;
    }

    function removeEvent(event: Event | null) {
        console.log(event);
        if(event === null) return;
        const index = $EventStore.findIndex(x => x.id == event.id);
        if(index != -1) {
            $EventStore = $EventStore.filter(x => x.id != event.id);
        }
        deleteModalOpen = false;
        dialog.close();
    }

    function addInactiveDateToEvent(event: Event | null) {
        if(event === null) return;
        const index = $EventStore.findIndex(x => x.id == event.id);
        $EventStore[index].inactiveDates = $EventStore[index].inactiveDates?.concat(activeDate.getTime()) ?? [activeDate.getTime()];
        deleteModalOpen = false;
        dialog.close();
    }

    // TODO: remove this on production
    onMount(() => {
        // window.addEventListener("contextmenu", function(e) { e.preventDefault(); });
    });

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
                        <div style="padding-top:1rem;">
                            {#each eventList as eventItem}
                                <EventCard eventItem={eventItem} bind:selectedEvent={selectedEvent} bind:modalOpen={modalOpen} bind:deleteModalOpen={deleteModalOpen} />
                            {/each}
                        </div>
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
            on:ionModalDidDismiss={()=>{modalOpen=false; selectedEvent=null; tmpEvent=null;}}
            on:ionModalWillPresent={setupModal}    
        >
            <ion-toolbar>
                <ion-buttons slot="end">
                    <ion-button id="sumbit" on:click={sumbit} aria-hidden>
                        <ion-icon slot="icon-only" icon={checkmark}/>
                    </ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">{selectedEvent?.title? selectedEvent.title : 'Συμβάν'}</ion-title>
                <ion-buttons slot="start">
                    <ion-button id="cancel" on:click={()=>{modalOpen=false; selectedEvent=null; tmpEvent=null;}} aria-hidden>
                        <ion-icon slot="icon-only" icon={close}/>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            <EventDetails bind:copyEvent={tmpEvent} />
        </ion-modal>

        <ion-alert
            is-open={deleteModalOpen}
            header="Διαγραφή συμβάντος"
            buttons={[
                {
                  text: 'Το τρέχον μόνο',
                  role: 'destructive',
                  handler: () => {
                    addInactiveDateToEvent(selectedEvent);
                  }
                },
                {
                  text: 'Το τρέχον και τα επόμενα',
                  role: 'destructive',
                  handler: () => {
                    removeEvent(selectedEvent);
                  }
                },
                {
                  text: 'Άκυρο',
                  role: 'cancel',                
                  handler: () => {
                    deleteModalOpen = false;
                    selectedEvent = null;
                  }
                }
              ]}
            mode="ios">
        </ion-alert>

    </ion-content>
</ion-tab>

<style>

    alert-button-role-cancel {
        color: var(--ion-color-primary) !important;
    }

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