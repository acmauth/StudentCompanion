<script>
	import { neoUniversisGet } from '$lib/dataService';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';
	import InfoItem  from '$lib/components/personalInfo/infoItem.svelte'
	import PersonSkeleton from '$components/personalInfo/personSkeleton.svelte';
	import { Capacitor } from '@capacitor/core';
	import Settings from '$components/personalInfo/settings.svelte';

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
		let personalData = await neoUniversisGet('Students/me/',{lifetime: 86000});
		let department = await neoUniversisGet('Students/me/department',{lifetime: 86000});
		let user = await neoUniversisGet('Users/me',{lifetime: 86000});
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
	<ion-header collapse="condense" mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
			<ion-title class="ion-padding-vertical" size="large">Πληροφορίες</ion-title>
		
		</ion-toolbar>
	</ion-header>
		
	<ion-content fullscreen={true}>
		{#await getPersonalInfo()}		
			<PersonSkeleton />
			<Settings logOut = {logOut} />


		{:then} 
		<InfoItem gender = {gender} aem = {aem} schoolGraduated = {schoolGraduated} birthDate = {birthDate} email = {email} familyName = {familyName} givenName = {givenName} username = {username} departmentName = {departmentName} semester = {semester} />
		
		<Settings logOut = {logOut} />

		{:catch error}
	        <p>Παρουσιάστηκε σφάλμα :&#40;</p>
			<p>{error.message}</p>
			<Settings logOut = {logOut} />
		{/await}

	</ion-content>

</ion-tab>
	
<style>
	
	ion-content {
--padding-end: 0.6rem;
--padding-start: 0.6rem;
}
	
</style>

