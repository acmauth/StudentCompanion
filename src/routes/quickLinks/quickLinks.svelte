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
	import campingLogo from '$lib/assets/campingLogo.png'; 
	import erasmusLogo from '$lib/assets/erasmusLogo.png'; 
	import { t, locale, locales} from "$lib/i18n";

	let department: any;
	let departmentName = '';
	let departmentURL = '';

	let links = [
		{
			linktitle: $t("links.uni"),
			linkaddress: 'https://www.auth.gr',
			imagelink: authLogo
		},
		{
			linktitle: 'eLearning',
			linkaddress: 'https://elearning.auth.gr',
			imagelink: elearningLogo
		},
		{
			linktitle: $t("links.mail"),
			linkaddress: 'https://webmail.auth.gr',
			imagelink: webmailLogo
		},
		{
			linktitle: $t("links.itc"),
			linkaddress: 'https://it.auth.gr',
			imagelink: itLogo
		},
		{
			linktitle: $t("links.sis"),
			linkaddress: 'https://students.auth.gr',
			imagelink: sisLogo
		},
		{
			linktitle: $t("links.eudoxos"),
			linkaddress: 'http://eudoxus.gr',
			imagelink: eudoxusLogo
		},
		{
			linktitle: $t("links.club"),
			linkaddress: 'http://www.pfl.auth.gr',
			imagelink: restaurantLogo
		},
		{
			linktitle: $t("links.gym"),
			linkaddress: 'https://gym.auth.gr/reservations/',
			imagelink: gymLogo
		},
		{
			linktitle: $t("links.camping"),
			linkaddress: 'https://camping.auth.gr/en/', 
			imagelink: campingLogo
		},
		{
			linktitle: $t("links.erasmus"), 
			linkaddress: 'https://eurep.auth.gr/', 
			imagelink: erasmusLogo
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


<ion-content >
	<SubPageHeader title={$t("links.title")} stackedNav />
	<div class="ion-padding">
		{#each links as { linktitle, linkaddress, imagelink }}
		<LinkCard {linktitle} {linkaddress} {imagelink} />
		{/each}
	</div>
</ion-content>
