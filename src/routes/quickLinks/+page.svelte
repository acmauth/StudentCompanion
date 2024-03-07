<script lang="ts">
	import LinkCard from '$components/quickLinks/linkCard.svelte';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import departmentLogo from '$lib/assets/departmentLogo.png';
	import authLogo from '$lib/assets/authLogo.png';
	import elearningLogo from '$lib/assets/elearningLogo.png';
	import webmailLogo from '$lib/assets/webmailLogo.png';
	import itLogo from '$lib/assets/itLogo.png';
	import sisLogo from '$lib/assets/sisLogo.png';
	import eudoxusLogo from '$lib/assets/eudoxusLogo.png';
	import restaurantLogo from '$lib/assets/restaurantLogo.png';
	import gymLogo from '$lib/assets/gymLogo.png';

	let department: any;
	let departmentName = '';
	let departmentURL = '';

	let links = [
		{
			linktitle: 'Ιστότοπος ΑΠΘ',
			linkaddress: 'https://www.auth.gr',
			imagelink: authLogo
		},
		{
			linktitle: 'eLearning',
			linkaddress: 'https://elearning.auth.gr',
			imagelink: elearningLogo
		},
		{
			linktitle: 'Ηλεκτρονικό Ταχυδρομείο',
			linkaddress: 'https://webmail.auth.gr',
			imagelink: webmailLogo
		},
		{
			linktitle: 'Κέντρο Ηλεκτρονικής Διακυβέρνησης',
			linkaddress: 'https://it.auth.gr',
			imagelink: itLogo
		},
		{
			linktitle: 'Ηλεκτρονική Γραμματεία Φοιτητών',
			linkaddress: 'https://students.auth.gr',
			imagelink: sisLogo
		},
		{
			linktitle: 'Εύδοξος',
			linkaddress: 'http://eudoxus.gr',
			imagelink: eudoxusLogo
		},
		{
			linktitle: 'Φοιτητική Λέσχη',
			linkaddress: 'http://www.pfl.auth.gr',
			imagelink: restaurantLogo
		},
		{
			linktitle: 'Πανεπιστημιακό Γυμναστήριο',
			linkaddress: 'https://gym.auth.gr',
			imagelink: gymLogo
		}
	];

	onMount(async () => {
		department = await universisGet('Students/me/department');
		departmentName = department.name;
		departmentURL = department.url;
		links = [
			{ linktitle: departmentName, linkaddress: departmentURL, imagelink: departmentLogo },
			...links
		];
	});
</script>

<SubPageHeader title="Χρήσιμοι σύνδεσμοι" />
<ion-content>
	{#each links as { linktitle, linkaddress, imagelink }}
		<LinkCard {linktitle} {linkaddress} {imagelink} />
	{/each}
</ion-content>
