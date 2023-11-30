<script>
	import * as allIonicIcons from 'ionicons/icons';
	import { universisGet } from '$lib/dataService';
	import { onMount } from 'svelte';
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';

	// Keep personal info

	let aem = '';
	let inscriptionYear = '';
	let fullName = '';
	let schoolGraduated = '';
	let birthDate = '';
	let email = '';
	let familyName = '';
	let givenName = '';
	let gender = '';
	let mobilePhone = '';
	let departmentName = '';
	let departmentAddress = '';
	let semester = '';

	// Get personal details and department details

	onMount(async () => {
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
		mobilePhone = personalData.person.mobilePhone;
		departmentName = department.abbreviation;
		departmentAddress = department.address;
		semester = personalData.semester;
	});

	// Log out
	function logOut(){
        invalidateAuth();
        goto("/");
    }

</script>
<ion-tab tab="personalInfo">
<ion-header>
	<ion-toolbar>
		<ion-title>Personal Info</ion-title>
	</ion-toolbar>
</ion-header>

<ion-content>
	<ion-card class="ion-padding">
		<ion-card-header class="ion-text-center info">
			{#if gender === 'Α'}
				<img class="avatar ion-padding-vertical" alt="man" src={man} width="60px" />
			{:else}
				<img class="avatar ion-padding-vertical" alt="man" src={woman} width="60px" />
			{/if}
			<ion-card-title>{givenName} {familyName}</ion-card-title>
		</ion-card-header>
	</ion-card>
	<ion-card>
		<ion-card-content>
			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.pricetag} />
				<ion-text class="ion-padding-start">{aem}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.person} />

				<ion-text class="ion-padding-start">{givenName} {familyName}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.school} />

				<ion-text class="ion-padding-start">{schoolGraduated}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.calendar} />

				<ion-text class="ion-padding-start">{birthDate}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-text class="ion-padding-start">{email}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.maleFemale} />

				<ion-text class="ion-padding-start">{gender === 'Α' ? 'Άντρας' : 'Γυναίκα'}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.call} />

				<ion-text class="ion-padding-start">{mobilePhone}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.location} />

				<ion-text class="ion-padding-start">{departmentName} {departmentAddress}</ion-text>
			</ion-item>

			<ion-item>
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-text class="ion-padding-start">{semester}ο Εξάμηνο</ion-text>
			</ion-item>

			<ion-item on:click={logOut}>
				<ion-icon color="danger" size="small" icon={allIonicIcons.exit} />

				<ion-text color="danger" class="ion-padding-start">Αποσύνδεση</ion-text>
			</ion-item>


		</ion-card-content>
	</ion-card>
</ion-content>
</ion-tab>

<style>
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
