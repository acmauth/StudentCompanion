<script>
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import { Browser } from '@capacitor/browser';
	import { onMount } from 'svelte';

	onMount(() => {
		openCapacitorSite();
	});

	async function openCapacitorSite() {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	};
</script>

<ion-content>
	<SubPageHeader title="Κρατήσεις Γυμναστηρίου" />
</ion-content>
