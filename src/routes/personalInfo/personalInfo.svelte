<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAuth } from '$lib/authentication/authValidator';

	// Log out function - exported for use in other components
	export async function logOut() {
		await invalidateAuth();
		console.log("[src/routes/pages/personalInfo/+page.svelte] Navigating to login");
		await goto('/login');
	}
</script>

<script lang="ts">
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { webmailLoggedIn } from '$components/webmailLogin/userCredsFlagStore';
	import { neoUniversisGet, universisGet } from '$lib/dataService';
	import { locale, locales, t } from '$lib/i18n';
	import { Capacitor } from '@capacitor/core';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import InfoItem from './infoItem.svelte';
	import PersonSkeleton from './personSkeleton.svelte';
	import Settings from './settings.svelte';
	import SubPageHeader from '$components/shared/subPageHeader.svelte';

	// Keep personal info

	let aem: String = '';
	let apm: String = '';
	let inscriptionYear: String = '';
	let birthDate: String = '';
	let email: String = '';
	let familyName: String = '';
	let givenName: String = '';
	let username: String = '';
	let gender: String = '';
	let departmentName: String = '';
	let semester: String = '';
	let study_level: String = '';

	// Get personal details and department details

	async function getPersonalInfo() {
		let personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel), department',
			{ lifetime: 86000 }
		);

		let user = await neoUniversisGet('Users/me', { lifetime: 86000 });
		aem = personalData.studentIdentifier;
		apm = personalData.uniqueIdentifier;
		inscriptionYear = personalData.inscriptionYear.name;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		username = user.name;
		familyName = personalData.person.familyName;
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = personalData.department.name;
		semester = personalData.semester;
		study_level = personalData.studyProgram.studyLevel.name;
	}
</script>

<IonPage>
	<SubPageHeader title={$t('settings.personal')} stackedNav />
	<ion-content fullscreen={true}>

		{#await getPersonalInfo()}
			<PersonSkeleton />
		{:then}
			<InfoItem
				{gender}
				{aem}
				{apm}
				{birthDate}
				{email}
				{familyName}
				{givenName}
				{username}
				{departmentName}
				{semester}
				{study_level}
			/>
		{:catch error}
			<ErrorLandingCard errorMsg={error.message} />
		{/await}
		<Settings {logOut} />
	</ion-content>
</IonPage>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>
