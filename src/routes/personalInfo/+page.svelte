<script>
	import { universisGet } from '$lib/dataService';
	import { onMount } from 'svelte';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';
	import InfoItem  from '$lib/components/personalInfo/infoItem.svelte'
	import PersonSkeleton from '$components/personalInfo/personSkeleton.svelte';
	import { Capacitor } from '@capacitor/core';

	// Keep personal info

	let aem = '';
	let inscriptionYear = '';
	let schoolGraduated = '';
	let birthDate = '';
	let email = '';
	let familyName = '';
	let givenName = '';
	let gender = '';
	let departmentName = '';
	let departmentAddress = '';
	let semester = '';

	// Get personal details and department details

	async function getPersonalInfo() {
		let personalData = await universisGet('Students/me/');
		let department = await universisGet('Students/me/department');
		aem = personalData.studentIdentifier;
		inscriptionYear = personalData.inscriptionYear.name;
		schoolGraduated = personalData.schoolGraduated;
		birthDate = personalData.person.birthDate.slice(0, 10);
		email = personalData.person.email;
		familyName = personalData.person.familyName;
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		departmentName = department.abbreviation;
		departmentAddress = department.address;
		semester = personalData.semester;
	}

	// Log out
	function logOut(){
        invalidateAuth();
        goto("/loginService");
    }

</script>

<ion-header collapse="condense" mode="ios">
	<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
		<ion-title class="ion-padding-vertical" size="large">Personal Info</ion-title>
	
	</ion-toolbar>
</ion-header>

	{#await getPersonalInfo()}
		<ion-content>
			<PersonSkeleton />
		</ion-content>
		
	{:then} 
	<InfoItem gender = {gender} aem = {aem} schoolGraduated = {schoolGraduated} birthDate = {birthDate} email = {email} familyName = {familyName} givenName = {givenName}  departmentName = {departmentName} departmentAddress = {departmentAddress} semester = {semester} logOut = {logOut} />

	{:catch error}
        <p>{error.message}</p>
	{/await}

	


