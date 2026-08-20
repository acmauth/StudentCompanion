<script lang="ts">
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { webmailLoggedIn } from '$components/webmailLogin/userCredsFlagStore';
	import { neoUniversisGet, universisGet } from '$lib/dataService';
	import { locale, locales, t } from '$lib/i18n';
	import { logOut } from '$lib/globalFunctions/logOut';
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

	async function getPersonalInfo(locale: string) {
		let expandedLocale = locale == 'el' ? '' : '($expand=locale)';

		let personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel' + expandedLocale + '), department' + expandedLocale + (expandedLocale !== '' ? ', person' + expandedLocale : ''),
			{ lifetime: 86000 }
		);

		aem = personalData.studentIdentifier;
		apm = personalData.uniqueIdentifier;
		inscriptionYear = personalData.inscriptionYear.name;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		username = email.split('@')[0];
		familyName = expandedLocale === ''
			? personalData.person.familyName
			: personalData.person.locale?.familyName ?? personalData.person.familyName;
		givenName = expandedLocale === ''
			? personalData.person.givenName
			: personalData.person.locale?.givenName ?? personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = expandedLocale === ''
			? personalData.department.name
			: personalData.department?.locale?.name ?? personalData.department.name;
		semester = personalData.actualSemester;
		study_level = expandedLocale === ''
			? personalData.studyProgram.studyLevel.name
			: personalData.studyProgram?.studyLevel?.locale?.name ?? personalData.studyProgram.studyLevel.name;
	}
</script>

<IonPage>
	<SubPageHeader title={$t('settings.personal')} stackedNav />
	<ion-content fullscreen={true}>

		{#await getPersonalInfo($locale)}
			<PersonSkeleton />
		{:then}
			<InfoItem
				{gender}
				{aem}
				{apm}
				{inscriptionYear}
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
