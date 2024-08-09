<script lang="ts">
    import { add, calendarClearOutline, close, checkmark } from 'ionicons/icons';
    import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
    import DateSwiper from '$lib/components/calendar/DateSwiper.svelte';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import EventDetails from '$lib/components/calendar/event/EventDetails.svelte';
    import type { Event } from '$lib/components/calendar/event/Event';
    import { EventRepeatType, EventType, EventCheckFormat } from '$lib/components/calendar/event/Event';
    import { isCurrentDay } from '$lib/components/calendar/CalendarFunctions';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import { universisGet } from '$src/lib/dataService';
    import { scheduleNotification } from '$src/lib/scheduledNotifications/calendarNotifications';
    import { permissionsService } from '$src/lib/scheduledNotifications/runtimePermissions';
	
    
    let activeDate: Date;
    let eventList: Event[];
    let selectedEvent: Event | null = null;
    let prototype: Event = {
        id: new Date().getTime(),
        title: "",
        slot: {
            start: new Date(),
            end: new Date(new Date().getTime() + 3600000)
        },
        type: EventType.TASK,
        description: "",
        repeat: EventRepeatType.NEVER,
        repeatUntil: new Date(new Date().getTime() + 3600000),
        repeatInterval: 1,
        notify: false,
        notifyTime: 1
    };
    let tmpEvent: Event = prototype;
    let modalOpen: boolean = false;
    let deleteModalOpen: boolean = false;

    $: eventList = $EventStore.filter(item => isCurrentDay(item, activeDate)).sort((a, b) => new Date(a.slot.start).getTime() < new Date(b.slot.start).getTime() ? -1 : 1);
    
    function sumbit() {
        const formatCheck = EventCheckFormat(tmpEvent);
        if(formatCheck.error) {
            showToast({
                    color: 'danger',
                    duration: 3000,
                    message: formatCheck.description,
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

        if (tmpEvent.notify){
            scheduleNotification(tmpEvent, undefined);
        }
        recreatePrototype();
        modalOpen = false;
    }    

    function recreatePrototype() {
        prototype = {
            id: new Date().getTime(),
            title: "",
            slot: {
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000)
            },
            type: EventType.TASK,
            description: "",
            repeat: EventRepeatType.NEVER,
            repeatUntil: new Date(new Date().getTime() + 3600000),
            repeatInterval: 1,
            notify: false,
            notifyTime: 1
        };
        tmpEvent = prototype;
    }

	async function showToast(toast: ToastOptions){
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

    function setupModal() {
        if(selectedEvent !== null) {
            tmpEvent = JSON.parse(JSON.stringify(selectedEvent));
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
    }

    function addInactiveDateToEvent(event: Event | null) {
        if(event === null) return;
        const index = $EventStore.findIndex(x => x.id == event.id);
        $EventStore[index].inactiveDates = $EventStore[index].inactiveDates?.concat(activeDate.getTime()) ?? [activeDate.getTime()];
        deleteModalOpen = false;
    }

    // remove this on production
    // window.addEventListener("contextmenu", function(e) { e.preventDefault(); });
    
    // To clear the EventStore, uncomment the line below
    // $EventStore = [];
    onMount(async() => {
        let fetchedExams = (await universisGet('students/me/availableCourseExamEvents?$top=-1')).value;
        $EventStore = $EventStore.concat(
            fetchedExams.map((exam) => {
                const existingIndex = $EventStore.findIndex(x => x.id == exam.id);
                if (existingIndex == -1) {
                    return {
                        id: exam.id,
                        title: exam.description,
                        description: exam.courseExam.course + ' - ' + exam.location.description,
                        type: EventType.TEST,
                        repeat: EventRepeatType.NEVER,
                        notify: false,
                        location: exam.location.description,
                        slot: {
                            start: new Date(exam.startDate),
                            end: new Date(exam.endDate)
                        }
                    };
                } else {
                    return null; // Return null if the exam already exists in $EventStore
                }
            }).filter(event => event !== null) // Filter out null values
        );
        console.log($EventStore);
    });

</script>

<ion-tab tab="calendar">
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
        <ion-title class="ion-padding-vertical" size="large" style="padding-top:0; padding-bottom:0;">Πρόγραμμα μαθημάτων</ion-title>
        <ion-buttons slot="secondary">
            <ion-button on:click={() => {modalOpen=true; selectedEvent=null; recreatePrototype();}} aria-hidden>
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
                        <div style="padding-top:0.6rem;">
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
            on:ionModalDidDismiss={()=>{modalOpen=false; selectedEvent=null; recreatePrototype();}}
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
                    <ion-button id="cancel" on:click={()=>{modalOpen=false; selectedEvent=null; recreatePrototype();}} aria-hidden>
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