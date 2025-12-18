<script lang="ts">
	import { neoUniversisGet } from '$lib/dataService';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';
	import InfoItem from '$lib/components/personalInfo/infoItem.svelte';
	import PersonSkeleton from '$components/personalInfo/personSkeleton.svelte';
	import { Capacitor } from '@capacitor/core';
	import Settings from '$components/personalInfo/settings.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { userCredsFlag } from '$components/webmailLogin/userCredsFlagStore';
	import { t, locale, locales } from '$lib/i18n';
	import {get} from 'svelte/store'
	import { localize } from '$src/lib/functions/localize';

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
	let deptSecretaryEmail: String = '';
	let academicId: String = '';

	// Get personal details and department details

	let personalData: any;

	async function getPersonalInfo() {
		personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel($expand=locale),department($expand=locale)),person($expand=locale)',
			{ lifetime: 86000 }
		);

		let user = await neoUniversisGet('Users/me', { lifetime: 86000 });
		console.log(user) //Access denied

		aem = personalData.studentIdentifier;
		apm = personalData.uniqueIdentifier;
		inscriptionYear = personalData.inscriptionYear.name;
		schoolGraduated = personalData.schoolGraduated;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		username = user.name;
		familyName = localize(personalData.person, "familyName", get(locale)); 
		givenName = localize(personalData.person, "givenName", get(locale)); 
		gender = personalData.person.gender; 
		//console.log(gender)
		departmentName = localize(personalData.studyProgram.department, "name", get(locale)); 
		semester = personalData.semester; 
		//console.log(semester)
		study_level = localize(personalData.studyProgram.studyLevel, "name", get(locale)); 
		deptSecretaryEmail = personalData.department.email;
		academicId = personalData.academicId;
	}

	// Log out
	function logOut() {
		invalidateAuth();
		console.log("[src/routes/pages/personalInfo/+page.svelte] Navigating to login");
		goto('/login');
	}
</script>

<ion-tab tab="personalInfo">
	<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
			<ion-title class="ion-padding-vertical" size="large">{$t('settings.personal')}</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen={true}>
		<ion-header collapse="condense" mode="ios">
			<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
				<ion-title size="large">{$t('settings.personal')}</ion-title>
			</ion-toolbar>
		</ion-header>

		{#await getPersonalInfo()}
			<PersonSkeleton />
		{:then}
			<InfoItem
				{personalData}
			/>
		{:catch error}
			<ErrorLandingCard errorMsg={error.message} />
		{/await}
		<Settings {logOut} />
	</ion-content>
</ion-tab>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>
