<script lang="ts">
    import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
    import type { DayObject } from './calendarUtils';
    import { getWeekdayNames, isSelectedDay as checkIsSelectedDay, isToday as checkIsToday } from './calendarUtils';
    import type { SelectedDay } from './calendarUtils';
    import { t, getLocale} from "$lib/i18n";
    // removed alertController

    export let weeks: DayObject[][] = [];
    export let month: number;
    export let year: number;
    export let selectedDay: SelectedDay | null = null;
    export let onPreviousMonth: () => void;
    export let onNextMonth: () => void;
    export let onSelectDay: (dayObj: DayObject) => void;
    export let onMonthYearChange: (newMonth: number, newYear: number) => void = () => {};

    const weekdayNames = getWeekdayNames();
    
    // Date Picker State
    let isDatePickerOpen = false;

    function openMonthYearPicker() {
        isDatePickerOpen = true;
    }

    function handleDateChange(e: CustomEvent) {
        const val = e.detail.value; 
        if (typeof val === 'string') {
            // Parse ISO string manually to avoid timezone issues with new Date()
            // Format is typically YYYY-MM-DD or YYYY-MM
            const parts = val.split(/[-T]/);
            if (parts.length >= 2) {
                const newYear = parseInt(parts[0], 10);
                const newMonth = parseInt(parts[1], 10) - 1; // 0-based
                onMonthYearChange(newMonth, newYear);
            }
        }
        isDatePickerOpen = false;
    }

    function getISOString(y: number, m: number) {
        // Construct YYYY-MM string locally
        return `${y}-${String(m + 1).padStart(2, '0')}`;
    }


    const minDate = `${new Date().getFullYear() - 10}-01`;
    const maxDate = `${new Date().getFullYear() + 10}-12`;

    $: isSelectedDay = (dayObj: DayObject) => {
        return checkIsSelectedDay(dayObj, selectedDay, month, year);
    };

    function isToday(dayObj: DayObject) {
        return checkIsToday(dayObj, month, year);
    }

    function hasEvents(dayObj: DayObject) {
        if (!dayObj || !dayObj.isCurrentMonth) return false;
        return dayObj.hasEvents;
    }
</script>

<div class="calendar">
    <div class="header">
        <ion-card href="" on:click={onPreviousMonth} aria-label="Previous month" class="navButton" aria-hidden="true">
            <ion-icon icon={chevronBackOutline} />
        </ion-card>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="month-title" on:click={openMonthYearPicker}>
            {new Date(year, month).toLocaleDateString(getLocale(), {
                month: 'long',
                year: 'numeric'
            })}
        </div>
        <ion-card href="" on:click={onNextMonth} aria-label="Next month" class="navButton" aria-hidden="true">
            <ion-icon icon={chevronForwardOutline} />
        </ion-card>
    </div>

    <div class="grid">
        {#each weekdayNames as dayName}
            <div class="day-name">{dayName}</div>
        {/each}

        {#each weeks as week}
            {#each week as dayObj}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="day {dayObj.isCurrentMonth
                        ? 'selectable'
                        : 'unselectable'} {isSelectedDay(dayObj) ? 'selected' : ''} {isToday(
                        dayObj
                    )
                        ? 'today'
                        : ''}"
                    on:click={() => onSelectDay(dayObj)}
                >
                    <span>{dayObj.day}</span>
                    {#if hasEvents(dayObj)}
                        <div class="event-badges">
                            {#each Array(Math.min(dayObj.eventCount, 3)) as _, i}
                                <div class="event-badge" />
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        {/each}
    </div>
    
    <ion-modal is-open={isDatePickerOpen} on:ionModalDidDismiss={() => isDatePickerOpen = false} style="--height: auto; --width: auto; --border-radius: 8px;">
        <ion-datetime
            presentation="month-year"
            value={getISOString(year, month)}
            min={minDate}
            max={maxDate}
            show-default-buttons={true}
            done-text={$t('common.apply', 'Apply')}
            cancel-text={$t('common.cancel', 'Cancel')}
            mode="ios"
            on:ionChange={handleDateChange}
            on:ionCancel={() => isDatePickerOpen = false}
        >
        </ion-datetime>
    </ion-modal>
</div>

<style>
    .navButton {
        background: transparent;
        border: none;
        color: inherit;
        border-radius: 1px;
        box-shadow: none;
        margin: 0;
        padding: 1rem;
    }

    .calendar {
        width: 100%;
        padding: 0rem 1rem 0.5rem 1rem;
        font-family: sans-serif;
        color: var(--ion-color-dark);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-shrink: 0;
    }
    .header .month-title {
        cursor: pointer;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background 0.15s ease;
        font-weight: 500;
    }
    .header .month-title:hover {
        background: var(--ion-color-light);
    }

    .header ion-icon {
        font-size: 1.15rem;
        color: var(--ion-color-dark);
        display: block;
        width: 1em;
        height: 1em;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 2.5rem;
        text-align: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .day-name {
        font-weight: bold;
        color: var(--ion-color-primary);
        padding: 0.25rem;
    }
    .day {
        padding: 0.5rem 0.25rem;
        border-radius: 8px;
        user-select: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 0;
        transition: all 0.15s ease;
        gap: 0.15rem;
    }
    .day.selectable:hover {
        background: var(--ion-color-light);
        cursor: pointer;
        transform: scale(1.05);
    }
    .day.today {
        color: var(--ion-color-primary);
        font-weight: 600;
    }
    .day.selected {
        background: var(--ion-color-light);
        color: var(--ion-color-dark);
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
    .day.selected.today {
        color: var(--ion-color-primary);
    }
    .day.unselectable {
        color: var(--ion-color-medium);
        cursor: pointer;
    }
    .event-badges {
        display: flex;
        gap: 2px;
        justify-content: center;
    }
    .event-badge {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--ion-color-primary);
        opacity: 0.8;
    }
</style>
