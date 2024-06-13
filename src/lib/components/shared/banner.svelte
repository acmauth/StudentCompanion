<script lang="ts">
	import ad1 from "$lib/assets/Advert_dark.png";
	import ad2 from "$lib/assets/Advert_light.png";
	export let altText : string;
	export let margin: string = "1.5";

	let marginStr = `margin: ${margin}rem;`;

	let random = Math.floor(Math.random() * 2) + 1;
</script>

<div style={marginStr} class="card-banner">
	{#if random === 1}
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad1} alt={altText} /></a>
	{:else}
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad2} alt={altText} /></a>
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
