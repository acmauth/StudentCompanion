<script>
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import { onMount } from 'svelte';
	
	onMount(() => {
		openCapacitorSite();
	});
	
	import { Browser } from '@capacitor/browser';
	async function openCapacitorSite() {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	};
</script>

<ion-content>
	<SubPageHeader title="Κρατήσεις Γυμναστηρίου" stackedNav/>
</ion-content>
