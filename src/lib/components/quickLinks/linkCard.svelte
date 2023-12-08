<script>
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from 'svelte';
	export let linktitle = '';
	export let linkaddress = '';

	function goToLinkaddress() {
		window.open(linkaddress, '_blank');
	}
</script>

<ion-card button on:click={goToLinkaddress}>
	<ion-card-header>
		<ion-card-title><b>{linktitle}</b></ion-card-title>
		<ion-card-subtitle>{linkaddress}</ion-card-subtitle>
	</ion-card-header>
</ion-card>
