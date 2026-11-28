<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    const R = 56;
    const CIRC = 2 * Math.PI * R;  // 351.86
    const HALF = Math.PI * R;       // 175.93 — the visible arc length

    export let value: number = 0;
    export let color: string = 'var(--ion-color-primary, #378ADD)';
    export let trackColor: string = 'var(--ion-color-light-shade, #e5e7eb)';
    export let strokeWidth: number = 13;
    export let trend: string | null = null;

    export let centerLabel: string = '';
    export let leftLabel: string = '';
    export let rightLabel: string = '';
    export let rightValue: string = '';
    export let rightDesc: string = '';
    export let bottomLabel: string = '';

    $: pct = Math.min(Math.max(Math.round(value), 0), 100);
    $: targetDrawn = HALF * (pct / 100);
    $: hasCenter = centerLabel.trim() !== '';
    $: hasStack = rightValue !== '' || rightDesc !== '';
    $: gaugeW = 80;
    $: gaugeH = 41;

    // Start at 0 (empty arc) and tween to the real drawn length.
    // Reactive set also handles smooth re-animation when `value` changes after mount.
    const animatedDrawn = tweened(0, { duration: 900, easing: cubicOut });
    $: animatedDrawn.set(targetDrawn);
</script>

<div class="pc-wrapper">
    {#if leftLabel}
        <span class="pc-side">{leftLabel}</span>
    {/if}
    <div class="pc-inner">              

        <svg
            width={gaugeW}
            height={gaugeH}
            viewBox="0 5 140 72"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle
            cx="70" cy="70" r={R}
            fill="none" stroke={trackColor} stroke-width={strokeWidth}
            stroke-linecap="round"
            transform="rotate(180 70 70)"
            stroke-dasharray="{HALF} {HALF}"
            />
            <circle
            cx="70" cy="70" r={R}
            fill="none" stroke={color} stroke-width={strokeWidth}
            stroke-linecap="round"
            transform="rotate(180 70 70)"
            stroke-dasharray="{$animatedDrawn} {CIRC - $animatedDrawn}"
            />
            {#if trend === 'up'}
                <polygon points="70,42 59,64 81,64" fill="#1D9E75" />
            {:else if trend === 'down'}
                <polygon points="70,64 59,42 81,42" fill="#E24B4A" />
            {:else if trend === 'stable'}
                <polygon points="70,64 59,64 81,64" fill="#F5A623" />
            {/if}

            {#if hasCenter}
                <text
                    x="70" y="64"
                    text-anchor="middle" dominant-baseline="auto"
                    font-size="24" font-weight="600"
                    fill="var(--ion-text-color, #111)"
                >{centerLabel}</text>
            {/if}
        </svg>
        
        {#if bottomLabel}
            <span class="pc-bottom">{bottomLabel}</span>
        {/if}
    </div>

    {#if rightLabel}
        <span class="pc-side">{rightLabel}</span>
    {/if}

    {#if hasStack}
        <div class="pc-stack">
        {#if rightValue}<span class="pc-stack-value">{rightValue}</span>{/if}
        {#if rightDesc}<span class="pc-stack-desc">{rightDesc}</span>{/if}
        </div>
    {/if}

</div>

<style>
    .pc-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .pc-side {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--ion-color-medium);
    }
    .pc-stack { display: flex; flex-direction: column; }
    .pc-stack-value {
        font-weight: 600;
        font-size: 1rem;
        color: var(--ion-text-color);
    }
    .pc-stack-desc {
        font-size: 0.8rem;
        color: var(--ion-color-medium);
    }

    .pc-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
    }

    .pc-bottom {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--ion-color-medium);
    }
</style>