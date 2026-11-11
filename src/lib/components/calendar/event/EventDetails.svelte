<script lang="ts">
    import type {Event} from '$components/calendar/event/Event';
    import {EventType, EventRepeatType, getEventTypeValue, getEventRepeatTypeValue, getEventRepeatTypeCycleValue} from '$components/calendar/event/Event';
    import { t, getLocale } from "$lib/i18n";
    import DateTimeRow from './DateTimeRow.svelte';
    import {
        navigateCircle, timeOutline, flagOutline, locationOutline, personOutline, documentTextOutline,
        repeatOutline, notificationsOutline, trashOutline, checkboxOutline, schoolOutline, createOutline,
        bookOutline, ellipsisHorizontalCircleOutline
    } from 'ionicons/icons';
    import { goto } from '$app/navigation';

    interface Props {
        copyEvent: Event;
        /** When provided (existing events), a delete button is shown at the bottom */
        onDelete?: () => void;
    }

    let { copyEvent = $bindable(), onDelete }: Props = $props();

    // Icon + accent colour per event type (colours match the dots on the calendar event cards)
    const TYPE_META: Record<EventType, { icon: string; rgb: string }> = {
        [EventType.TASK]: { icon: checkboxOutline, rgb: '30, 136, 229' },
        [EventType.TEST]: { icon: schoolOutline, rgb: '229, 56, 53' },
        [EventType.ASSIGNMENT]: { icon: createOutline, rgb: '251, 138, 0' },
        [EventType.CLASS]: { icon: bookOutline, rgb: '67, 160, 72' },
        [EventType.OTHER]: { icon: ellipsisHorizontalCircleOutline, rgb: '140, 140, 140' }
    };

    // Keep the selected type chip visible in the horizontally scrolling row (e.g. "Class" sits off-screen to the right)
    let typeRow: HTMLElement | undefined = $state();
    let typeRowScrolled = false;

    function revealSelectedType() {
        const row = typeRow;
        const chip = row?.querySelector<HTMLElement>('.type-chip.selected');
        if (!row || !chip || row.clientWidth === 0) return false;
        const left = Math.max(0, chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2);
        row.scrollTo({ left, behavior: typeRowScrolled ? 'smooth' : 'auto' });
        typeRowScrolled = true;
        return true;
    }

    $effect(() => {
        copyEvent.type; // re-run when the type changes
        if (!typeRow || revealSelectedType()) return;
        // Not laid out yet (modal still hidden): reveal once the row gets a size
        const observer = new ResizeObserver(() => { if (revealSelectedType()) observer.disconnect(); });
        observer.observe(typeRow);
        return () => observer.disconnect();
    });

    $effect.pre(() => {
        if (copyEvent.repeat !== EventRepeatType.NEVER) {
            copyEvent.repeatInterval = parseInt(String(copyEvent.repeatInterval ?? 1));
        }
    });

    // Which inline date/time picker is expanded (only one at a time), e.g. "start-date"
    let openPicker: string | null = $state(null);

    function updateStartTime(start: Date) {
        copyEvent.slot.start = start;
        // The end always follows the start: start + 1 hour
        copyEvent.slot.end = new Date(start.getTime() + 3600000);
    }

    function updateEndTime(newEnd: Date) {
        const start = new Date(copyEvent.slot.start).getTime();
        copyEvent.slot.end = newEnd.getTime() < start ? new Date(start + 3600000) : newEnd;
    }
</script>


<ion-content force-overscroll class="sheet-body">

    <!-- Title & time -->
    <section class="group">
        <ion-item lines="full">
            <ion-input
                class="title-input"
                label-placement="floating"
                id="title"
                type="text"
                value={copyEvent.title || null}
                contenteditable="true"
                spellcheck={true}
                onionChange={(event)=>{copyEvent.title = event.detail.value || '';}}
            >
                <!-- Slotted label so it can stay regular weight while the typed title is medium -->
                <span slot="label" class="title-label">{$t('event.name')}</span>
            </ion-input>
        </ion-item>
        <DateTimeRow
            id="start"
            label={$t('event.start')}
            icon={timeOutline}
            value={copyEvent.slot.start}
            onChange={updateStartTime}
            max="2500-12-31"
            lines="inset"
            bind:openPicker
        />
        <DateTimeRow
            id="end"
            label={$t('event.end')}
            icon={flagOutline}
            value={copyEvent.slot.end}
            onChange={updateEndTime}
            min={copyEvent.slot.start}
            max="2500-12-31"
            lines="none"
            bind:openPicker
        />
    </section>

    <!-- Type -->
    <div class="section-label">{$t('event.type')}</div>
    <div class="type-chips" bind:this={typeRow}>
        {#each Object.values(EventType) as type}
            {@const meta = TYPE_META[type]}
            <ion-chip
                class="type-chip"
                class:selected={copyEvent.type === type}
                style="--chip-rgb: {meta.rgb};"
                onclick={() => copyEvent.type = type}
                aria-pressed={copyEvent.type === type}
                role="button"
                tabindex="0"
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyEvent.type = type; }}
            >
                <ion-icon icon={meta.icon}></ion-icon>
                <ion-label>{getEventTypeValue(type, getLocale())}</ion-label>
            </ion-chip>
        {/each}
    </div>

    <!-- Details -->
    <section class="group">
        <ion-item lines="inset">
            <ion-icon slot="start" icon={locationOutline}></ion-icon>
            {#if copyEvent.location && copyEvent.locationCode}
                <ion-label>{$t('event.location')}</ion-label>
                <ion-chip
                    outline
                    class="location-chip"
                    onclick={() => { if (copyEvent.locationCode) goto("/pages/maps?roomid=" + copyEvent.locationCode);}}
                    aria-hidden
                >
                    <ion-icon icon={navigateCircle}></ion-icon>
                    <ion-label>{copyEvent.location}</ion-label>
                </ion-chip>
            {:else}
                <ion-input
                    label={$t('event.location')}
                    label-placement="floating"
                    id="location"
                    type="text"
                    value={copyEvent.location || null}
                    contenteditable="true"
                    spellcheck={true}
                    onionChange={(event)=>copyEvent.location=event.detail.value?? ""}
                ></ion-input>
            {/if}
        </ion-item>

        {#if copyEvent.type == EventType.CLASS}
            <ion-item lines="inset">
                <ion-icon slot="start" icon={personOutline}></ion-icon>
                <ion-input
                    label={$t('event.professor')}
                    label-placement="floating"
                    id="professor"
                    type="text"
                    value={copyEvent.professor || null}
                    contenteditable="true"
                    spellcheck={false}
                    onionChange={(event)=>copyEvent.professor=event.detail.value ?? ""}
                ></ion-input>
            </ion-item>
        {/if}

        <ion-item lines="none">
            <ion-icon slot="start" icon={documentTextOutline}></ion-icon>
            <ion-textarea
                label={$t('event.description')}
                label-placement="floating"
                id="description"
                auto-grow={true}
                value={copyEvent.description || null}
                contenteditable="true"
                spellcheck={true}
                onionChange={(event)=>copyEvent.description=event.detail.value ?? ""}
            ></ion-textarea>
        </ion-item>
    </section>

    <!-- Repeat & reminder -->
    <section class="group">
        <ion-item lines="inset">
            <ion-icon slot="start" icon={repeatOutline}></ion-icon>
            <ion-select id="repeatSelector" label={$t("event.isRepeated")} interface="popover" value={copyEvent.repeat} onionChange={(event)=>{copyEvent.repeat=event.detail.value;}}>
                {#each Object.values(EventRepeatType) as type}
                    <ion-select-option value={type}>{getEventRepeatTypeValue(type, getLocale())}</ion-select-option>
                {/each}
            </ion-select>
        </ion-item>

        {#if copyEvent.repeat != EventRepeatType.NEVER}
            <ion-item lines="inset" class="sub-item">
                <ion-label>{$t("event.notification.repeatPer")}</ion-label>
                <ion-input
                    id="repeatInterval"
                    class="number-input"
                    type="number"
                    placeholder="1"
                    min="1"
                    step="1"
                    max="10"
                    value={copyEvent.repeatInterval ?? 1}
                    contenteditable="true"
                    onionChange={(event)=>{
                        let inputValue = parseInt(event.detail.value);
                        if (inputValue < 1 || isNaN(inputValue)) {
                            inputValue = 1;
                        }
                        copyEvent.repeatInterval = inputValue;
                        event.target.value = inputValue;
                    }}
                ></ion-input>
                <ion-label class="cycle-label">
                    {getEventRepeatTypeCycleValue(copyEvent.repeat, getLocale())}
                </ion-label>
            </ion-item>

            <DateTimeRow
                id="until"
                label={$t("event.notification.repeatUntil")}
                value={copyEvent.repeatUntil ?? copyEvent.slot.end}
                onChange={(date) => copyEvent.repeatUntil = date}
                min={copyEvent.slot.start}
                minuteValues="0,15,30,45"
                lines="inset"
                subItem
                bind:openPicker
            />
        {/if}

        <ion-item lines={copyEvent.notify ? 'inset' : 'none'}>
            <ion-icon slot="start" icon={notificationsOutline}></ion-icon>
            <ion-select label={$t('event.notification')} interface="popover" value={copyEvent.notify} onionChange={(event)=>{copyEvent.notify=event.detail.value;}}>
                <ion-select-option value={true}>{$t('option.yesL')}</ion-select-option>
                <ion-select-option value={false}>{$t('option.noL')}</ion-select-option>
            </ion-select>
        </ion-item>

        {#if copyEvent.notify}
            <ion-item lines="none" class="sub-item">
                <ion-input
                    label={$t('event.notifyTime')}
                    label-placement="floating"
                    id="notifyTime"
                    type="number"
                    min="1"
                    step="1"
                    max="10"
                    value={copyEvent?.notifyTime || null}
                    contenteditable="true"
                    spellcheck={false}
                    onionChange={(event)=>{
                        let inputValue = parseInt(event.detail.value);
                        if (inputValue < 1 || isNaN(inputValue)) {
                            inputValue = 1;
                        }
                        copyEvent.notifyTime = inputValue;
                        event.target.value = inputValue;
                    }}
                ></ion-input>
            </ion-item>
        {/if}
    </section>

    {#if onDelete}
        <ion-button id="delete" class="delete-btn" expand="block" fill="clear" color="danger" onclick={onDelete}>
            <ion-icon slot="start" icon={trashOutline}></ion-icon>
            {$t('event.delete')}
        </ion-button>
    {/if}
</ion-content>


<style>
    .sheet-body {
        /* card surface: white on the light grey sheet (like the homepage cards), step-50 in dark mode */
        --group-bg: #fff;
        --background: var(--ion-background-color, #fff);
        --padding-start: 1rem;
        --padding-end: 1rem;
        --padding-bottom: 2rem;
    }

    :global(body.dark) .sheet-body {
        --group-bg: var(--ion-color-step-50, #1e1e1e);
    }

    /* Rounded field groups instead of full-width divider rows */
    .group {
        margin-bottom: 1rem;
        border-radius: 1rem;
        overflow: hidden;
        background: var(--group-bg);
    }

    /* :global so the rows rendered by DateTimeRow get the same styling */
    .group :global(ion-item) {
        --background: transparent;
        --border-color: var(--ion-color-step-150, #d9d9d9);
        --padding-start: 0.9rem;
        --inner-padding-end: 0.9rem;
    }

    .group :global(ion-item > ion-icon[slot="start"]) {
        margin-inline-end: 0.9rem;
        color: var(--ion-color-medium);
        font-size: 1.25rem;
    }

    .group :global(ion-item.sub-item) {
        --padding-start: 3.05rem; /* aligns with the text of the item above */
    }

    .title-input {
        font-size: 1.1rem;
        font-weight: 500;
    }

    .title-label {
        font-weight: 400;
    }

    .section-label {
        margin: 0 0.25rem 0.4rem;
        font-size: 0.85rem;
        color: var(--ion-color-step-600, #999);
    }

    /* Event type chips: a single, horizontally scrollable row; only the selected type is coloured */
    .type-chips {
        position: relative; /* offsetParent for the chips (used to scroll the selected one into view) */
        display: flex;
        flex-wrap: nowrap;
        gap: 0.4rem;
        overflow-x: auto;
        scrollbar-width: none;
        /* bleed to the sheet edges so chips scroll under the padding */
        margin: 0 -1rem 1rem;
        padding: 0 1rem;
    }

    .type-chips::-webkit-scrollbar {
        display: none;
    }

    .type-chip {
        flex: 0 0 auto;
        margin: 0;
        height: 2rem;
        font-size: 0.85rem;
        --background: var(--group-bg);
        --color: var(--ion-color-step-700, #4d4d4d);
        border: 1px solid transparent;
        transition: background-color 0.15s, border-color 0.15s, color 0.15s;
    }

    .type-chip ion-icon {
        color: var(--ion-color-medium);
        font-size: 1rem;
    }

    .type-chip.selected {
        --background: rgba(var(--chip-rgb), 0.12);
        --color: rgb(var(--chip-rgb));
        border-color: rgba(var(--chip-rgb), 0.6);
        font-weight: 600;
    }

    .type-chip.selected ion-icon {
        color: rgb(var(--chip-rgb));
    }

    .location-chip {
        cursor: pointer;
        flex-shrink: 1;
        min-width: 0;
        margin-inline-start: auto;
    }

    .location-chip ion-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 10rem;
        display: block;
    }

    .number-input {
        max-width: 3.5rem;
        text-align: center;
    }

    .cycle-label {
        flex: 0 0 auto;
        margin-inline-start: 0.5rem;
    }

    .delete-btn {
        margin-top: 0.5rem;
        text-transform: none;
        font-weight: 600;
    }
</style>
