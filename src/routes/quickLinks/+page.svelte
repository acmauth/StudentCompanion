<script>
	import LinkCard from '$components/quickLinks/linkCard.svelte';
	import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import { invalidateAuth } from '$lib/authentication/authValidator';

	let department = '';
	let departmentName = '';
	let departmentURL = '';

	let links = [
		{ linktitle: 'Ιστότοπος ΑΠΘ', linkaddress: 'https://www.auth.gr' },
		{ linktitle: 'eLearning', linkaddress: 'https://elearning.auth.gr' },
		{ linktitle: 'Ηλεκτρονικό Ταχυδρομείο', linkaddress: 'https://webmail.auth.gr' },
		{ linktitle: 'Κέντρο Ηλεκτρονικής Διακυβέρνησης', linkaddress: 'https://it.auth.gr' },
		{ linktitle: 'Ηλεκτρονική Γραμματεία Φοιτητών', linkaddress: 'https://students.auth.gr' },
		{ linktitle: 'Εύδοξος', linkaddress: 'http://eudoxus.gr' },
		{ linktitle: 'Φοιτητική Λέσχη', linkaddress: 'http://www.pfl.auth.gr' },
		{ linktitle: 'Πανεπιστημιακό Γυμναστήριο', linkaddress: 'https://gym.auth.gr' }
	];

	onMount(async () => {
		department = await universisGet('Students/me/department');
		departmentName = department.name;
		departmentURL = department.url;
		console.log(departmentName);
		console.log(departmentURL);
		links = [{ linktitle: departmentName, linkaddress: departmentURL }, ...links];
	});
</script>

<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
	<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
		<ion-title>Quick Links</ion-title>
	</ion-toolbar>
</ion-header>
<ion-content>
	<ion-header collapse="condense" mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
			<ion-title size="large">Quick Links</ion-title>
		</ion-toolbar>
	</ion-header>
	{#each links as { linktitle, linkaddress }}
		<LinkCard {linktitle} {linkaddress} />
	{/each}
</ion-content>
