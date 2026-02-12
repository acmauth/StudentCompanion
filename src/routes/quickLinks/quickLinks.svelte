<script lang="ts">
	import LinkCard from '$components/quickLinks/linkCard.svelte';
	import { onMount } from 'svelte';
	import { universisGet } from '$lib/dataService';
	import SubPageHeader from '$shared/subPageHeader.svelte';
	// import departmentLogo from '$lib/assets/departmentLogo.png';
	import authLogo from '$lib/assets/authLogo.png';
	import elearningLogo from '$lib/assets/elearningLogo.png';
	import webmailLogo from '$lib/assets/webmailLogo.png';
	import itLogo from '$lib/assets/itLogo.png';
	import sisLogo from '$lib/assets/sisLogo.png';
	import eudoxusLogo from '$lib/assets/eudoxusLogo.png';
	// import restaurantLogo from '$lib/assets/restaurantLogo.png';
	// import gymLogo from '$lib/assets/gymLogo.png';
	import campingLogo from '$lib/assets/campingLogo.png';
	import erasmusLogo from '$lib/assets/erasmusLogo.png';
	import { t } from '$lib/i18n';

	let department: any;
	let departmentName = '';
	let departmentURL = '';

	let links = [
		{
			linktitle: $t('links.club'),
			linkaddress: 'http://www.pfl.auth.gr',
			imagelink: undefined
		},
		{
			linktitle: $t('links.gym'),
			linkaddress: 'https://gym.auth.gr/reservations/',
			imagelink: undefined
		},
		{
			linktitle: $t('links.uni'),
			linkaddress: 'https://www.auth.gr',
			imagelink: authLogo
		},
		{
			linktitle: 'eLearning',
			linkaddress: 'https://elearning.auth.gr',
			imagelink: elearningLogo
		},
		{
			linktitle: $t('links.mail'),
			linkaddress: 'https://webmail.auth.gr',
			imagelink: webmailLogo
		},
		{
			linktitle: $t('links.itc'),
			linkaddress: 'https://it.auth.gr',
			imagelink: itLogo
		},
		{
			linktitle: $t('links.sis'),
			linkaddress: 'https://students.auth.gr',
			imagelink: sisLogo
		},
		{
			linktitle: $t('links.eudoxos'),
			linkaddress: 'http://eudoxus.gr',
			imagelink: eudoxusLogo
		},
		{
			linktitle: $t('links.camping'),
			linkaddress: 'https://camping.auth.gr/en/',
			imagelink: campingLogo
		},
		{
			linktitle: $t('links.erasmus'),
			linkaddress: 'https://eurep.auth.gr/',
			imagelink: erasmusLogo
		}
	];

	onMount(async () => {
		department = await universisGet('Students/me/department');
		departmentName = department.name;
		departmentURL = department.url;
		if (!departmentURL.startsWith('http')) departmentURL = 'https://' + departmentURL;
		links = [
			{ linktitle: departmentName, linkaddress: departmentURL, imagelink: undefined },
			...links
		];
	});
</script>

<ion-page>
	<SubPageHeader title={$t('links.title')} stackedNav />
	<ion-content>
		<div class="ion-padding" style="margin-bottom: 4rem;">
			{#each links as { linktitle, linkaddress, imagelink }}
			<LinkCard {linktitle} {linkaddress} {imagelink} />
			{/each}
		</div>
	</ion-content>
</ion-page>
