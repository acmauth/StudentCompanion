<script>
	import LinkCard from '$components/quickLinks/linkCard.svelte';
	import { Capacitor } from '@capacitor/core';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import restaurant from '$lib/assets/restaurant.png';
	import sportsfitness from '$lib/assets/sportsfitness.png';
	import departmentLogo from '$lib/assets/departmentLogo.png';
	import SubPageHeader from '$shared/subPageHeader.svelte';

	let department = '';
	let departmentName = '';
	let departmentURL = '';

	let links = [
		{
			linktitle: 'Ιστότοπος ΑΠΘ',
			linkaddress: 'https://www.auth.gr',
			imagelink: 'https://www.auth.gr/wp-content/uploads/LogoAUTH300ppi.png'
		},
		{
			linktitle: 'eLearning',
			linkaddress: 'https://elearning.auth.gr',
			imagelink:
				'https://elearning.auth.gr/pluginfile.php/2374889/block_html/content/elearning-59F.png'
		},
		{
			linktitle: 'Ηλεκτρονικό Ταχυδρομείο',
			linkaddress: 'https://webmail.auth.gr',
			imagelink: 'https://it.auth.gr/wp-content/uploads/2022/01/mail59F-2.png'
		},
		{
			linktitle: 'Κέντρο Ηλεκτρονικής Διακυβέρνησης',
			linkaddress: 'https://it.auth.gr',
			imagelink: 'https://it.auth.gr/wp-content/uploads/2023/10/it-auth-logo.png'
		},
		{
			linktitle: 'Ηλεκτρονική Γραμματεία Φοιτητών',
			linkaddress: 'https://students.auth.gr',
			imagelink: 'https://sis.auth.gr/assets/sis-128.png'
		},
		{
			linktitle: 'Εύδοξος',
			linkaddress: 'http://eudoxus.gr',
			imagelink: 'https://service.eudoxus.gr/search/images/eudoxus-logo.png'
		},
		{
			linktitle: 'Φοιτητική Λέσχη',
			linkaddress: 'http://www.pfl.auth.gr',
			imagelink: restaurant
		},
		{
			linktitle: 'Πανεπιστημιακό Γυμναστήριο',
			linkaddress: 'https://gym.auth.gr',
			imagelink: sportsfitness
		}
	];

	onMount(async () => {
		department = await universisGet('Students/me/department');
		// @ts-ignore
		departmentName = department.name;
		// @ts-ignore
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
