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
    
    $EventStore = [{ id: 1,
    title: "Study Group Meeting",
    slot: 
        {
            start: new Date("2024-05-17T10:00:00"),
            end: new Date("2024-05-17T12:00:00")
        }
    ,
    location: "Library",
    description: "Discussing upcoming exam topics",
    professor: "Dr. Smith",
    type: EventType.CLASS,
    repeat: EventRepeatType.DAILY,
    repeatInterval: 2,
    repeatUntil: new Date("2027-01-01T23:59:59"),
    notify: true,
    notifyTime: 30}]
    
    $: eventList = $EventStore.filter(item => isCurrentDay(item, activeDate)).sort((a, b) => a.slot.start.getTime() < b.slot.start.getTime() ? -1 : 1);
    
    function isCurrentDay(event: Event, active: Date): boolean {
        const activeDate = new Date(active);
        const start = new Date(event.slot.start);
        const end = new Date(event.slot.end? event.slot.end : event.slot.start);

        if(event.repeat == EventRepeatType.NEVER) {
            return (
                start.getFullYear() === activeDate.getFullYear() &&
                start.getMonth() === activeDate.getMonth() &&
                start.getDate() === activeDate.getDate()
            );
        }
        
        if (!event.repeatUntil || !event.repeatInterval) return false;

        const repeatUntil = new Date(event.repeatUntil);
        const repeatInterval = event.repeatInterval;
        
        let distance: number = 0;

        if(event.repeat == EventRepeatType.DAILY) {
            const intervalMilliseconds = repeatInterval * 24 * 60 * 60 * 1000;
            const totalDuration = repeatUntil.getTime() - start.getTime();
            const fullIntervals = Math.floor(totalDuration / intervalMilliseconds);
            const lastOccurrence = new Date(start.getTime() + fullIntervals * intervalMilliseconds);

            const dayDistance = (date1: Date, date2: Date) => {
                const diffTime = date2.getTime() - date1.getTime();
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            };

            const distance = dayDistance(start, activeDate);
            return (
                distance >= 0 &&
                distance % repeatInterval === 0 &&
                activeDate.getTime() <= lastOccurrence.getTime()
            );
        }

        if (event.repeat == EventRepeatType.WEEKLY) {
            const dayDistance = (date1: Date, date2: Date): number => {
                return (new Date(date1.setHours(0,0,0,0)).getTime() - new Date(date2.setHours(0,0,0,0)).getTime()) / (1000 * 60 * 60 * 24);
            }

            const intervalMilliseconds = repeatInterval * 7 * 24 * 60 * 60 * 1000;
            const totalDuration = repeatUntil.getTime() - start.getTime();
            const fullIntervals = Math.floor(totalDuration / intervalMilliseconds);
            const lastOccurrence = new Date(start.getTime() + fullIntervals * intervalMilliseconds);
            
            distance = dayDistance(activeDate, start);
            return (distance >= 0 && distance % (repeatInterval * 7) === 0 && activeDate.getTime() <= lastOccurrence.getTime() && start.getDay() === activeDate.getDay());
        }

        if (event.repeat == EventRepeatType.MONTHLY) {
            const getMonthsDifference = (startDate: Date, endDate: Date) => {
                return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
            };

            const totalMonths = getMonthsDifference(start, repeatUntil);
            const fullIntervals = Math.floor(totalMonths / repeatInterval);
            const lastOccurrence = new Date(start);
            lastOccurrence.setMonth(start.getMonth() + fullIntervals * repeatInterval);

            const isSameDayOfMonth = (date1: Date, date2: Date) => date1.getDate() === date2.getDate();

            const monthDistance = getMonthsDifference(start, activeDate);
            return (
                monthDistance >= 0 &&
                monthDistance % repeatInterval === 0 &&
                activeDate.getTime() <= lastOccurrence.getTime() &&
                isSameDayOfMonth(start, activeDate)
            );
        }

        if(event.repeat == EventRepeatType.YEARLY) {
            const getYearsDifference = (startDate: Date, endDate: Date) => {
                return endDate.getFullYear() - startDate.getFullYear();
            };

            const totalYears = getYearsDifference(start, repeatUntil);
            const fullIntervals = Math.floor(totalYears / repeatInterval);
            const lastOccurrence = new Date(start);
            lastOccurrence.setFullYear(start.getFullYear() + fullIntervals * repeatInterval);

            const isSameDayOfYear = (date1: Date, date2: Date) => {
                return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
            };

            const yearDistance = getYearsDifference(start, activeDate);
            return (
                yearDistance >= 0 &&
                yearDistance % repeatInterval === 0 &&
                activeDate.getTime() <= lastOccurrence.getTime() &&
                isSameDayOfYear(start, activeDate)
            );
        }

        return false;
    }

    function sumbit() {
        if(tmpEvent?.id == selectedEvent?.id) {
            console.log(tmpEvent?.repeatUntil);
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
        modalOpen=true;
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
                        <div style="padding-top:1rem;">
                            {#each eventList as eventItem}
                                <EventCard eventItem={eventItem} bind:selectedEvent={selectedEvent} bind:modalOpen={modalOpen} />
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