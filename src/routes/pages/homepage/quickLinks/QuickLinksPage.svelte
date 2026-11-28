<script lang="ts">
	import LinkCard from '$components/homepage/quickLinks/LinkCard.svelte';
	import { onMount } from 'svelte';
	import { universisGet } from '$services/dataService';
	import SubPageHeader from '$common/SubPageHeader.svelte';
	// import departmentLogo from '$assets/homepage/quickLinks/departmentLogo.png';
	import authLogo from '$assets/common/university/authLogo.png';
	import elearningLogo from '$assets/homepage/quickLinks/elearningLogo.png';
	import webmailLogo from '$assets/homepage/quickLinks/webmailLogo.png';
	import itLogo from '$assets/homepage/quickLinks/itLogo.png';
	import sisLogo from '$assets/homepage/quickLinks/sisLogo.png';
	import eudoxusLogo from '$assets/homepage/quickLinks/eudoxusLogo.png';
	// import restaurantLogo from '$assets/homepage/quickLinks/restaurantLogo.png';
	// import gymLogo from '$assets/homepage/quickLinks/gymLogo.png';
	import campingLogo from '$assets/homepage/quickLinks/campingLogo.png';
	import erasmusLogo from '$assets/homepage/quickLinks/erasmusLogo.png';
	import { t } from '$methods/i18n';

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
