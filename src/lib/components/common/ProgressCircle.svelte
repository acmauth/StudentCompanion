<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  const R = 56;
  const CIRC = 2 * Math.PI * R;

  export let value: number = 0;
  export let color: string = 'var(--ion-color-primary, #378ADD)';
  export let trackColor: string = 'var(--ion-color-light-shade, #e5e7eb)';
  export let strokeWidth: number = 15;

  export let centerLabel: string = '';
  export let leftLabel: string = '';
  export let rightLabel: string = '';
  export let rightValue: string = '';   // bold top line in stacked block
  export let rightDesc: string = '';    // muted bottom line in stacked block

  $: pct = Math.min(Math.max(Math.round(value), 0), 100);
  $: targetOffset = CIRC * (1 - pct / 100);
  $: hasCenter = centerLabel.trim() !== '';
  $: hasStack = rightValue !== '' || rightDesc !== '';
  $: circleSize = hasCenter ? 100 : 50;

  // Start fully "empty" (offset = full circumference) and tween to the real value.
  // Reactive set also handles smooth re-animation when `value` changes after mount.
  const animatedOffset = tweened(CIRC, { duration: 900, easing: cubicOut });
  $: animatedOffset.set(targetOffset);
</script>

<div class="pc-wrapper">
  {#if leftLabel}
    <span class="pc-side">{leftLabel}</span>
  {/if}

  <svg
    width={circleSize}
    height={circleSize}
    viewBox="0 0 140 140"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="70" cy="70" r={R} fill="none" stroke={trackColor} stroke-width={strokeWidth} />
    <circle
      cx="70" cy="70" r={R}
      fill="none" stroke={color} stroke-width={strokeWidth}
      stroke-linecap="round" transform="rotate(-90 70 70)"
      stroke-dasharray={CIRC} stroke-dashoffset={$animatedOffset}
    />
    {#if hasCenter}
      <text x="70" y="70" text-anchor="middle" dominant-baseline="central"
        font-size="28" font-weight="600" fill="var(--ion-text-color, #111)"
      >{centerLabel}</text>
    {/if}
  </svg>

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

  .pc-stack {
    display: flex;
    flex-direction: column;
  }

  .pc-stack-value {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--ion-text-color);
  }

  .pc-stack-desc {
    font-size: 0.8rem;
    color: var(--ion-color-medium);
  }
</style>