<script lang="ts">
	import ad1 from "$lib/assets/Advert_dark.png";
	import tifad from "$lib/assets/Advert_TIF.png";
	export let altText : string;
	export let margin: string = "1.5";
	import { close } from "ionicons/icons";
	import { isDeleted } from './dismissableStore';

	let marginStr = `margin: ${margin}rem;`;
	const date = new Date();
	let validDateForTif = false;

	if (date.getFullYear() == 2024 && date.getMonth() == 8 && [11, 12, 13].includes(date.getDate())) {
		validDateForTif = true;
	}

	function deleteBanner(){
		isDeleted.set(true);
	}
</script>

{#if !$isDeleted}
	<div style={marginStr} class="card-banner">
		{#if validDateForTif}
			<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={tifad} alt={altText} /></a>
		{:else}
			<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad1} alt={altText} /></a>
		{/if}
		<ion-icon class="xmark" icon={ close } on:click={deleteBanner}></ion-icon>
	</div>
{/if}

<style>
	.card-banner {
		margin: 1rem;
		position: relative;
	}

	.card-banner img {
		object-fit: cover;
		width: 100%;
		aspect-ratio: 20/6;
		border-radius: 1rem;
	}

	.xmark {
		position: absolute;
		top: 0;
		right: 0;
		color: white;
		font-size: 35px;
		opacity: 0.8;
	}
</style>
