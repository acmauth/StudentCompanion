<script lang="ts">
    import { slide } from 'svelte/transition';
    import { locale } from '$lib/i18n';

    type Mode = 'date' | 'time';

    /** Unique per row; used to make sure only one inline picker is open at a time */
    export let id: string;
    export let label: string;
    export let icon: string | undefined = undefined;
    export let value: Date | string;
    export let onChange: (date: Date) => void;
    /** Earliest selectable day */
    export let min: Date | string | undefined = undefined;
    /** Latest selectable day (YYYY-MM-DD) */
    export let max: string | undefined = undefined;
    /** Comma-separated minute values for the time wheel, e.g. "0,15,30,45" */
    export let minuteValues: string | undefined = undefined;
    export let lines: 'full' | 'inset' | 'none' = 'inset';
    export let subItem: boolean = false;
    /** Id + mode of the picker currently open across all rows, e.g. "start-date" */
    export let openPicker: string | null = null;

    const pad = (n: number) => String(n).padStart(2, '0');
    const toDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    // Local wall-clock time without an offset, which is what ion-datetime expects
    const toLocalValue = (d: Date) => `${toDay(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    function safeDate(v: Date | string | undefined): Date | undefined {
        if (v === undefined) return undefined;
        const d = new Date(v);
        return isNaN(d.getTime()) ? undefined : d;
    }

    let date: Date;
    $: date = safeDate(value) ?? new Date();

    let minDay: string | undefined;
    $: {
        const d = safeDate(min);
        minDay = d ? toDay(d) : undefined;
    }

    let mode: Mode | null;
    $: mode = openPicker === `${id}-date` ? 'date' : openPicker === `${id}-time` ? 'time' : null;

    $: dateLabel = date.toLocaleDateString($locale, { day: 'numeric', month: 'short', year: 'numeric' });
    $: timeLabel = date.toLocaleTimeString($locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

    function toggle(m: Mode) {
        openPicker = mode === m ? null : `${id}-${m}`;
    }

    function handleChange(e: CustomEvent) {
        const raw = e.detail.value;
        const str = String(Array.isArray(raw) ? raw[0] : raw ?? '');
        const next = new Date(date);
        // Merge only the part this picker edits, parsing manually so "YYYY-MM-DD" isn't read as UTC
        const day = /(\d{4})-(\d{2})-(\d{2})/.exec(str);
        const time = /(?:T|^)(\d{2}):(\d{2})/.exec(str);
        if (mode === 'date' && day) next.setFullYear(+day[1], +day[2] - 1, +day[3]);
        if (mode === 'time' && time) next.setHours(+time[1], +time[2], 0, 0);
        if (next.getTime() !== date.getTime()) onChange(next);
    }

    function reveal(e: Event) {
        (e.currentTarget as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
</script>

<ion-item lines={mode ? 'none' : lines} class:sub-item={subItem}>
    {#if icon}
        <ion-icon slot="start" {icon}></ion-icon>
    {/if}
    <ion-label>{label}</ion-label>
    <div class="dt-chips">
        <button type="button" class="dt-chip" class:active={mode === 'date'} aria-expanded={mode === 'date'} on:click={() => toggle('date')}>
            {dateLabel}
        </button>
        <button type="button" class="dt-chip" class:active={mode === 'time'} aria-expanded={mode === 'time'} on:click={() => toggle('time')}>
            {timeLabel}
        </button>
    </div>
</ion-item>

{#if mode}
    <div class="dt-picker" class:divider={lines !== 'none'} transition:slide={{ duration: 200 }} on:introend={reveal}>
        {#key mode}
            {#if mode === 'date'}
                <ion-datetime
                    presentation="date"
                    locale={$locale}
                    value={toLocalValue(date)}
                    min={minDay}
                    {max}
                    on:ionChange={handleChange}
                ></ion-datetime>
            {:else}
                <ion-datetime
                    presentation="time"
                    prefer-wheel={true}
                    locale={$locale}
                    hour-cycle="h23"
                    minute-values={minuteValues}
                    value={toLocalValue(date)}
                    on:ionChange={handleChange}
                ></ion-datetime>
            {/if}
        {/key}
    </div>
{/if}

<style>
    .dt-chips {
        display: flex;
        gap: 0.35rem;
        flex-shrink: 0;
    }

    .dt-chip {
        appearance: none;
        border: 0;
        margin: 0;
        font: inherit;
        font-size: 0.95rem;
        font-variant-numeric: tabular-nums;
        padding: 0.35rem 0.65rem;
        border-radius: 0.5rem;
        background: var(--ion-color-step-100, #ededed);
        color: var(--ion-text-color, #000);
        cursor: pointer;
        transition: background-color 0.15s, color 0.15s;
    }

    .dt-chip.active {
        background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.14);
        color: var(--ion-color-primary);
    }

    .dt-picker {
        display: flex;
        justify-content: center;
        overflow: hidden;
    }

    .dt-picker.divider {
        border-bottom: 0.55px solid var(--ion-color-step-150, #d9d9d9);
    }

    .dt-picker ion-datetime {
        --background: transparent;
        margin: 0 auto;
    }
</style>
