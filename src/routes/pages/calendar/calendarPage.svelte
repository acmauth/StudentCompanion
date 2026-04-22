<script lang="ts">
    import { onMount } from 'svelte';
    import { add } from 'ionicons/icons';
    import { EventStore } from '$lib/components/calendar/event/EventStore';
    import EventCard from '$lib/components/calendar/event/EventCard.svelte';
    import EventModal from '$lib/components/calendar/event/EventModal.svelte';
    import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
    import { isCurrentDay } from '$lib/components/calendar/CalendarFunctions';
    import type { Event } from '$lib/components/calendar/event/Event';
    import { EventRepeatType, EventType } from '$lib/components/calendar/event/Event';
    import { scheduleNotification } from '$src/lib/calendarNotifications/scheduleNotifications';
    import { handleNotificationPermission, handleExactAlarmPermission } from '$src/lib/calendarNotifications/runtimePermissions';
    import { removePastNotifications } from '$src/lib/calendarNotifications/repeatedNotifications';
    import { deleteEventNotifications, deleteSingleEventNotification } from '$src/lib/calendarNotifications/notificationFunctions';
    import { getLocale, t } from '$lib/i18n';
    import { buildCalendarWeeks, type DayObject, type SelectedDay, getNextMonth, getPreviousMonth, fetchUniversisEvents } from '$lib/components/calendar/calendarUtils';
	import { page } from '$app/stores';

    let currentDate = new Date();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();

    let weeks: DayObject[][] = [];
    let selectedDay: SelectedDay | null = null;
    let activeDate = new Date();
    let eventList: Event[] = [];

    // Event creation and editing
    let selectedEvent: Event | null = null;
    let modalOpen: boolean = false;
    let deleteModalOpen: boolean = false;

    $: prototypeEvent = {
         id: new Date().getTime(),
            title: "",
            slot: {
                start: new Date(activeDate.getTime()),
                end: new Date(activeDate.getTime() + 3600000),
            },
            type: EventType.TASK,
            description: "",
            repeat: EventRepeatType.NEVER,
            repeatUntil: new Date(activeDate.getTime() + 3600000),
            repeatInterval: 1,
            notify: false,
            notifyTime: 1
    }

    $: eventList = $EventStore
        .filter((item) => isCurrentDay(item, activeDate))
        .sort((a, b) =>
            new Date(a.slot.start).getTime() < new Date(b.slot.start).getTime() ? -1 : 1
        );

    function buildCalendar() {
        weeks = buildCalendarWeeks(month, year, $EventStore);
    }

    function nextMonth() {
        const next = getNextMonth(month, year);
        month = next.month;
        year = next.year;
        buildCalendar();
    }

    function previousMonth() {
        const prev = getPreviousMonth(month, year);
        month = prev.month;
        year = prev.year;
        buildCalendar();
    }

    function selectDay(dayObj: DayObject) {
        if (dayObj) {
            if (!dayObj.isCurrentMonth) {
                // Navigate to the appropriate month
                if (dayObj.day > 15) {
                    previousMonth();
                } else {
                    nextMonth();
                }
                setTimeout(() => {
                    selectedDay = { day: dayObj.day, month, year };
                    activeDate = new Date(year, month, dayObj.day);
                }, 0);
            } else {
                selectedDay = { day: dayObj.day, month, year };
                activeDate = new Date(year, month, dayObj.day);
            }
        }
    }

    function handleMonthYearChange(newMonth: number, newYear: number) {
        month = newMonth;
        year = newYear;
        buildCalendar();
    }

    function handleEventSubmit(event: Event) {
        const index = $EventStore.findIndex(x => x.id === event.id);

        if (index !== -1) {
            $EventStore[index] = event;
            $EventStore = $EventStore;
        } else {
            $EventStore = $EventStore.concat(event);
        }
        
        buildCalendar();

        if (event.notify) {
            handleNotificationPermission();
            handleExactAlarmPermission(); 
            removePastNotifications();
            scheduleNotification(event); 
        }
        
        selectedEvent = null;
        modalOpen = false;
    }

    function handleEventDelete(event: Event) {
        const index = $EventStore.findIndex(x => x.id === event.id);
        if (index !== -1) {
            $EventStore = $EventStore.filter(x => x.id !== event.id);
        }
        buildCalendar();
        
        if (event.notify) {
            deleteEventNotifications(event);
        }
        
        modalOpen = false;
    }

    function handleModalClose() {
        selectedEvent = null;
        modalOpen = false;
    }

    function openNewEventModal() {
        selectedEvent = prototypeEvent;
        modalOpen = true;
    }

    function openEditEventModal(event: Event) {
        selectedEvent = event;
        modalOpen = true;
    }

    function addInactiveDateToEvent(event: Event | null) {
        if (event === null) return;
        const index = $EventStore.findIndex(x => x.id === event.id);
        $EventStore[index].inactiveDates = $EventStore[index].inactiveDates?.concat(activeDate.getTime()) ?? [activeDate.getTime()];
        $EventStore = $EventStore;
        buildCalendar();
        deleteModalOpen = false;
        
        if (event.repeat !== EventRepeatType.NEVER) {
            deleteSingleEventNotification(event);
        } else {
            deleteEventNotifications(event);
        }
    }

    //uncomment to clear events on each mount (for debugging)
    // $EventStore = [];
    onMount(async () => {
        let initialDate = currentDate;

        const launchEventIdStr = $page.url.searchParams.get("showEventId")
        const launchEventDateStr = $page.url.searchParams.get("eventDate")

        if (launchEventDateStr) {
            const launchEventDate: Date = new Date(decodeURIComponent(launchEventDateStr));
            // console.log(launchEventDate)
            initialDate = launchEventDate
            activeDate = initialDate;
            month = initialDate.getMonth();
            year = initialDate.getFullYear();

            if (launchEventIdStr) {
                const launchEventId = parseInt(decodeURIComponent(launchEventIdStr))
                const event = $EventStore.find(e => e.id === launchEventId);
                if (event) {
                    selectedEvent = event;
                    modalOpen = true;
                }
            }
        }


        // Initialize selectedDay to today or param date
        selectedDay = { day: initialDate.getDate(), month: initialDate.getMonth(), year: initialDate.getFullYear() };
        buildCalendar();
        await fetchUniversisEvents();        
        buildCalendar();
    });
</script>

<ion-page>
<ion-content fullscreen class="ion-no-padding" scroll-y={false}>
    <ion-header collapse="condense" mode="ios">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <ion-toolbar mode="md">
            <ion-title size="large">{$t('schedule.title')}</ion-title>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ion-button style="font-size: 1rem;margin-inline-end:1rem;" slot="end" on:click={openNewEventModal} fill="clear">
                <ion-icon icon={add} slot="icon-only"></ion-icon>
            </ion-button>
        </ion-toolbar>
    </ion-header>
    
    <div class="page-wrapper">
    <div class="container">
        <CalendarGrid
    {weeks}
    {month}
    {year}
    {selectedDay}
    onPreviousMonth={previousMonth}
    onNextMonth={nextMonth}
    onSelectDay={selectDay}
    onMonthYearChange={handleMonthYearChange}/>
    
    <!-- Events Section -->
    <div class="events-section">
        <h3 style="align-self:center;">
            {activeDate.toLocaleDateString(getLocale(), {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
        </h3>
        {#if eventList.length > 0}
            <div class="events-list">
                {#each eventList as eventItem}
                    <EventCard
                    {eventItem}
                    bind:selectedEvent
                    bind:modalOpen
                    bind:deleteModalOpen
                    bind:activeDate
                    />
                {/each}
            </div>
        {:else}
            <p class="no-events">
                {$t('schedule.no_events_day')}
            </p>
            {/if}
        </div>
        
        <!-- Event Creation/Edit Modal -->
        {#if selectedEvent}
        <EventModal
        bind:isOpen={modalOpen}
        bind:event={selectedEvent}
        onSubmit={handleEventSubmit}
        onDelete={handleEventDelete}
        onClose={handleModalClose}
        />
        {/if}
        
        <!-- Delete Event Alert -->
        <ion-alert
        is-open={deleteModalOpen}
        header={$t('event.delete')}
        buttons={[
            {
                text: $t('event.deleteThis'),
                role: 'destructive',
                handler: () => {
                    addInactiveDateToEvent(selectedEvent);
                }
            },
            {
                text: $t('event.deleteAll'),
                role: 'destructive',
                handler: () => {
                    if (selectedEvent) {
                        handleEventDelete(selectedEvent);
                        deleteModalOpen = false;
                    }
                }
            },
            {
                text: $t('event.cancel'),
                role: 'cancel',
                handler: () => {
                    deleteModalOpen = false;
                    selectedEvent = null;
                }
            }
        ]}
        mode="ios">
    </ion-alert>
</div>
</div>
</ion-content>
</ion-page>
<style>
    .page-wrapper {
        height: 100%;
        overflow: hidden;
    }
    .container {
        width: 100%;
        height: 100%;
        margin-top: -0.5rem;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .events-section {
        flex: 1 1 0;
        margin: 0;
        padding: 1.25rem 0 0 0;
        display: flex;
        flex-direction: column;
        background: var(--ion-color-light);
        border-radius: 16px 16px 0 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        min-height: 0;
        overflow: hidden;
    }
    .events-section h3 {
        color: var(--ion-color-dark);
        margin: 0 0 1rem 0;
        padding: 0 1.25rem;
        font-size: 1rem;
        font-weight: 600;
        flex-shrink: 0;
        letter-spacing: 0.01em;
    }
    .events-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow-y: auto;
        flex: 1;
        margin-bottom: 3rem;
        padding: 0 1.25rem calc(1.25rem + 56px + env(safe-area-inset-bottom, 0px)) 1.25rem;
    }
    .no-events {
        text-align: center;
        color: var(--ion-color-medium);
        padding: 2rem 1.25rem;
        font-size: 0.9rem;
    }
</style>
