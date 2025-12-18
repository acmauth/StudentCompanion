<script lang="ts">
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	import { Clipboard } from '@capacitor/clipboard';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import {locale} from '$lib/i18n'
	import {get} from 'svelte/store'

	export let gender: String;
	console.log(get(locale))
	if(get(locale) == "el"){
		gender = gender == 'Α' ? 'Άντρας' : 'Γυναίκα';
		console.log(gender)
	}
	else {
		console.log(gender.charCodeAt(0))
		gender = gender.charCodeAt(0) == 65 || gender.charCodeAt(0) == 913 ? "Male" : "Female";
		console.log(gender)
	}
	export let username: String;
	export let familyName: String;
	export let givenName: String;
	export let aem: String;
	export let apm: String;
	export let schoolGraduated: String;
	export let birthDate: String;
	export let email: String;
	export let departmentName: String;
	export let semester: String;
	if(get(locale) == "el")semester = `${semester}ο Εξάμηνο`;
	else{
		switch(String(semester)){
			case "1":
				semester = `${semester}st Semester`
				break;
			case "2":
				semester = `${semester}nd Semester`
				break;
			case "3":
				semester = `${semester}rd Semester`
				break;
			default:
				semester = `${semester}th Semester`
				break;
		}
	}
	export let study_level: String;
	export let deptSecretaryEmail: String;
	export let academicId: String;

	// Function to show toast
	async function showToast(toast: ToastOptions) {
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

	// Function to copy to clipboard
	const writeToClipboard = async (info: string) => {
		await Clipboard.write({
			string: info
		});

		showToast({
			color: 'tertiary',
			duration: 3000,
			message: 'Αντιγράφηκε στο πρόχειρο',
			mode: 'ios',
			translucent: true,
			layout: 'stacked',
			positionAnchor: 'tab-button-homepage',
			cssClass: 'custom-toast'
		});
	};
</script>

<ion-card class="ion-padding">
	<ion-card-header class="ion-text-center info">
		{#if gender === 'Άντρας' || 'Male'}
			<img class="avatar ion-padding-vertical" alt="man" src={man} width="60px" />
		{:else}
			<img class="avatar ion-padding-vertical" alt="woman" src={woman} width="60px" />
		{/if}
		<ion-card-title>{givenName} {familyName}</ion-card-title>
		<ion-item lines="none">
			<ion-card-subtitle>{aem}</ion-card-subtitle>
		</ion-item>
	</ion-card-header>
</ion-card>
<ion-card>
	<ion-card-content>
		{#if username}
			<ion-item id="copyMessage" button="true" on:click={writeToClipboard(username)}>
				<ion-icon size="small" icon={allIonicIcons.person} />

				<ion-label class="ion-padding-start">{username}</ion-label>
			</ion-item>
		{/if}

		{#if schoolGraduated}
			<ion-item button="true" on:click={writeToClipboard(schoolGraduated)}>
				<ion-icon size="small" icon={allIonicIcons.school} />

				<ion-label class="ion-padding-start">{schoolGraduated}</ion-label>
			</ion-item>
		{/if}

		{#if apm}
			<ion-item button="true" on:click={writeToClipboard(apm)}>
				<ion-icon size="small" icon={allIonicIcons.idCard} />

				<ion-label class="ion-padding-start">{apm}</ion-label>
			</ion-item>
		{/if}

		{#if academicId}
			<ion-item button="true" on:click={writeToClipboard(academicId)}>
				<ion-icon size="small" icon={allIonicIcons.idCard} />

				<ion-label class="ion-padding-start">{academicId}</ion-label>
			</ion-item>
		{/if}

		{#if birthDate}
			<ion-item button="true" on:click={writeToClipboard(birthDate)}>
				<ion-icon size="small" icon={allIonicIcons.calendar} />

				<ion-label class="ion-padding-start">{birthDate}</ion-label>
			</ion-item>
		{/if}

		{#if email}
			<ion-item button="true" on:click={writeToClipboard(email)}>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-label class="ion-padding-start">{email}</ion-label>
			</ion-item>
		{/if}

		{#if deptSecretaryEmail}
			<ion-item button="true" on:click={writeToClipboard(deptSecretaryEmail)}>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-label class="ion-padding-start">{deptSecretaryEmail}</ion-label>
			</ion-item>
		{/if}

		{#if gender}
			<ion-item button="true" on:click={writeToClipboard(gender)}>
				<ion-icon size="small" icon={allIonicIcons.maleFemale} />
				<ion-label class="ion-padding-start">{gender}</ion-label>
			</ion-item>
		{/if}

		{#if departmentName}
			<ion-item button="true" on:click={writeToClipboard(departmentName)}>
				<ion-icon size="small" icon={allIonicIcons.location} />

				<ion-label class="ion-padding-start">{departmentName}</ion-label>
			</ion-item>
		{/if}

		{#if semester}
			<ion-item button="true" on:click={writeToClipboard(semester)}>
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-label class="ion-padding-start">{semester}</ion-label>
			</ion-item>
		{/if}

		{#if study_level}
			<ion-item button="true" on:click={writeToClipboard(study_level)} lines="none">
				<ion-icon size="small" icon={allIonicIcons.book} />

				<ion-label class="ion-padding-start">{study_level}</ion-label>
			</ion-item>
		{/if}
	</ion-card-content></ion-card
>

<style>
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ion-icon {
		color: var(--app-color-icons);
	}

	ion-card-subtitle {
		font-size: 1.2rem;
		padding-left: 5px;
	}
</style>
