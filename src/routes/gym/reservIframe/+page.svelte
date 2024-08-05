<script>
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import { Browser } from '@capacitor/browser';

	const openCapacitorSite = async () => {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	};
</script>

<ion-content>
	<SubPageHeader title="Κρατήσεις Γυμναστηρίου" />
	{openCapacitorSite()}
</ion-content>
