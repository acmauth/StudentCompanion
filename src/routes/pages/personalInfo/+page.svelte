<script>
	import { universisGet } from '$lib/dataService';
	import { onMount } from 'svelte';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';
	import InfoItem  from '$lib/components/personalInfo/infoItem.svelte'
	import PersonSkeleton from '$components/personalInfo/personSkeleton.svelte';
	import { Capacitor } from '@capacitor/core';
	import Settings from '$components/personalInfo/settings.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';

	// Keep personal info

	let aem = '';
	let inscriptionYear = '';
	let schoolGraduated = '';
	let birthDate = '';
	let email = '';
	let familyName = '';
	let givenName = '';
	let username = '';
	let gender = '';
	let departmentName = '';
	let semester = '';

	// Get personal details and department details

	async function getPersonalInfo() {
		let personalData = await universisGet('Students/me/');
		let department = await universisGet('Students/me/department');
		let user = await universisGet('Users/me');
		aem = personalData.studentIdentifier;
		inscriptionYear = personalData.inscriptionYear.name;
		schoolGraduated = personalData.schoolGraduated;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		username = user.name;
		familyName = personalData.person.familyName;
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = department.abbreviation;
		semester = personalData.semester;
	}

	// Log out
	function logOut(){
        invalidateAuth();
        goto("/login");
    }

</script>


<ion-tab tab="personalInfo">
    <ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
		  <ion-title>Προσωπικές πληροφορίες</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen={true}>
		<ion-header collapse="condense" mode="ios">
			<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
				<ion-title size="large">Προσωπικές πληροφορίες</ion-title>
			</ion-toolbar>
		</ion-header>
	
		{#await getPersonalInfo()}		
			<PersonSkeleton />
			<Settings logOut = {logOut} />
		{:then} 
			<InfoItem gender = {gender} aem = {aem} schoolGraduated = {schoolGraduated} birthDate = {birthDate} email = {email} familyName = {familyName} givenName = {givenName} username = {username} departmentName = {departmentName} semester = {semester} />
			
			<Settings logOut = {logOut} />
		{:catch error}
			<ErrorLandingCard errorMsg={error.message}/>
		{/await}
	</ion-content>
</ion-tab>
	
	