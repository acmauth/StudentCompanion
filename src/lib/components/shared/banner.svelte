<script lang="ts">
	import ad1 from "$lib/assets/Advert_dark.png";
	export let altText : string;
	export let margin: string = "1.5";

	let marginStr = `margin: ${margin}rem;`;

</script>

<div style={marginStr} class="card-banner">
		<a href="https://forms.gle/wTAch9wZPKwztc5EA" target="_blank"><img src={ad1} alt={altText} /></a>
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
