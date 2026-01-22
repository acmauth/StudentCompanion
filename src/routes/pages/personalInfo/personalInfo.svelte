<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { webmailLoggedIn } from '$components/webmailLogin/userCredsFlagStore';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { neoUniversisGet } from '$lib/dataService';
	import { locale, locales, t } from '$lib/i18n';
	import { Capacitor } from '@capacitor/core';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import InfoItem from './infoItem.svelte';
	import PersonSkeleton from './personSkeleton.svelte';
	import Settings from './settings.svelte';

	// Keep personal info

	let aem: String = '';
	let apm: String = '';
	let inscriptionYear: String = '';
	let schoolGraduated: String = '';
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
		schoolGraduated = personalData.schoolGraduated;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		username = user.name;
		familyName = personalData.person.familyName;
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = personalData.department.abbreviation;
		semester = personalData.semester;
		study_level = personalData.studyProgram.studyLevel.name;
	}

	// Log out
	function logOut() {
		invalidateAuth();
		console.log('[src/routes/pages/personalInfo/+page.svelte] Navigating to login');
		goto('/login');
	}
</script>

<IonPage>
	<ion-content fullscreen={true}>
		<ion-header collapse="condense" mode="ios">
			<ion-toolbar mode="md">
				<ion-title size="large">{$t('settings.personal')}</ion-title>
			</ion-toolbar>
		</ion-header>

		{#await getPersonalInfo()}
			<PersonSkeleton />
		{:then}
			<InfoItem
				{gender}
				{aem}
				{apm}
				{schoolGraduated}
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
