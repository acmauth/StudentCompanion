<script lang='ts'>
    import QRGenerator from '$lib/components/wallet/QRGenerator.svelte';
    import { qrStore } from '$lib/components/wallet/qrStore';
	import { onMount } from 'svelte';
    import type { qrItem } from '$lib/components/wallet/qrItem';
    onMount(() => {
        const qr1: qrItem = { data: '1518   9', title: 'paso' };
        const qr2: qrItem = { data: '1589', title: 'gym' };
        $qrStore = [qr1, qr2];
    });
</script>

<div style="display: flex; flex-direction: column; align-items: center;">

{#if $qrStore.length > 0}
    {#each $qrStore as item}
    <div>
        <QRGenerator qr1={item}/>
    </div>
        {/each}
{:else}
    <p>...</p>
{/if}
</div>