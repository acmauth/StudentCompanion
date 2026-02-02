<script lang="ts">
    import { onMount } from 'svelte';
    import { add } from 'ionicons/icons';
    import { calendarNavigation } from '$components/calendar/calendarNavigation';
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
    import { buildCalendarWeeks, type DayObject, type SelectedDay, getNextMonth, getPreviousMonth, getCoursesEvents } from '$lib/components/calendar/calendarUtils';

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

    let prototypeEvent: Event = null;
    $: prototypeEvent = {
         id: new Date().getTime(),
            title: "",
            slot: {
                start: new Date(activeDate.getTime()).setHours(new Date().getHours(), new Date().getMinutes()),
                end: new Date(new Date(activeDate.getTime()).getTime() + 3600000),
            },
            type: EventType.TASK,
            description: "",
            repeat: EventRepeatType.NEVER,
            repeatUntil: new Date(new Date(activeDate.getTime()).getTime() + 3600000),
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

    // function createPrototypeEvent(): Event {
    //     const currentTime = new Date();
    //     const activeDateCurrentTime = new Date(activeDate.getTime());
    //     activeDateCurrentTime.setHours(currentTime.getHours(), currentTime.getMinutes());
        
    //     return {
    //         id: new Date().getTime(),
    //         title: "",
    //         slot: {
    //             start: activeDateCurrentTime,
    //             end: new Date(activeDateCurrentTime.getTime() + 3600000),
    //         },
    //         type: EventType.TASK,
    //         description: "",
    //         repeat: EventRepeatType.NEVER,
    //         repeatUntil: new Date(activeDateCurrentTime.getTime() + 3600000),
    //         repeatInterval: 1,
    //         notify: false,
    //         notifyTime: 1
    //     };
    // }

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

        // Check for navigation params from store
        if ($calendarNavigation) {
            if ($calendarNavigation.date) {
                initialDate = $calendarNavigation.date;
                activeDate = initialDate;
                month = initialDate.getMonth();
                year = initialDate.getFullYear();
            }
            
            // Open event modal immediately if event exists in store
            if ($calendarNavigation.eventId) {
                const event = $EventStore.find(e => e.id === $calendarNavigation.eventId);
                if (event) {
                    selectedEvent = event;
                    modalOpen = true;
                }
                // Clear the navigation params after use
                calendarNavigation.clear();
            }
        }

        // Initialize selectedDay to today or param date
        selectedDay = { day: initialDate.getDate(), month: initialDate.getMonth(), year: initialDate.getFullYear() };
        buildCalendar();
        await getCoursesEvents();        
        buildCalendar();
    });
</script>

<ion-content fullscreen class="ion-no-padding" scroll-y="false">
    <ion-header collapse="condense" mode="ios">
        <ion-toolbar mode="md">
            <ion-title size="large">{$t('schedule.title')}</ion-title>
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
        
        <!-- FAB Button for adding new event -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <ion-fab vertical="bottom" horizontal="end">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ion-fab-button on:click={openNewEventModal}>
                <ion-icon icon={add}></ion-icon>
            </ion-fab-button>
        </ion-fab>
        
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
        padding: 0 1.25rem 1.25rem 1.25rem;
    }
    .no-events {
        text-align: center;
        color: var(--ion-color-medium);
        padding: 2rem 1.25rem;
        font-size: 0.9rem;
    }
    ion-fab {
        margin-bottom: 4rem;
        margin-right: 1rem;
    }
    ion-fab-button {
        --background: var(--ion-color-primary);
        --color: white;
        --border-radius: 16px;
        --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 56px;
        height: 56px;
    }
    ion-fab-button:hover {
        --box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
        transform: scale(1.05);
    }
    ion-fab-button::part(native) {
        border-radius: 16px;
    }
    ion-fab-button ion-icon {
        font-size: 28px;
    }
</style>
