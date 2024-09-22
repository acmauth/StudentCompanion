<script lang="ts">
	import ad1 from "$lib/assets/Advert_dark.png";
	import tifad from "$lib/assets/Advert_TIF.png";
	export let altText : string;
	export let margin: string = "1.5";

	let marginStr = `margin: ${margin}rem;`;
	const date = new Date();
	let validDateForTif = false;
	// console.log(date.getFullYear(), date.getMonth(), date.getDate());

	if (date.getFullYear() == 2024 && date.getMonth() == 8 && [11, 12, 13].includes(date.getDate())) {
		validDateForTif = true;
	}
</script>

<div style={marginStr} class="card-banner">
	{#if validDateForTif}
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={tifad} alt={altText} /></a>
	{:else}
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad1} alt={altText} /></a>
	{/if}
</div>

<style>
	.card-banner {
		margin: 1rem;
	}

	.card-banner img {
		object-fit: contain;
		width: 100%;
		border-radius: 1rem;
	}


</style>
