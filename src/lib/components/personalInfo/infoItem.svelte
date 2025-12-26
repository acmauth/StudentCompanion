<script lang="ts">
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	import { Clipboard } from '@capacitor/clipboard';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import {locale} from '$lib/i18n'
	import {get} from 'svelte/store'
	import {localize, sem_suffix} from '$src/lib/translations/localize'

	export let personalData: any;


	$: currentLocale = $locale;

	$: aem = personalData?.studentIdentifier;
	$: apm = personalData?.uniqueIdentifier;
	$: username = null;
	$: schoolGraduated = personalData?.schoolGraduated;
	$: birthDate = personalData?.person.birthDate.slice(0, 10);
	$: email = personalData?.person.email;
	$: familyName = localize(personalData?.person, "familyName", currentLocale); 
	$: givenName = localize(personalData?.person, "givenName", currentLocale); 
	$: gender = (() => {
		const g = personalData?.person?.gender;
		if (!g) return '';

		const isMale = g === 'Α' || g.charCodeAt(0) === 913;

		if (currentLocale === 'el') {
			return isMale ? 'Άντρας' : 'Γυναίκα';
		}

		return isMale ? 'Male' : 'Female';
	})();

	$: departmentName = localize(personalData?.studyProgram.department, "name", currentLocale); 
	$: semester = (() => {
		const s = personalData?.semester;
		if (!s) return '';

		if (currentLocale === 'el') {
			return `${s}ο Εξάμηνο`;
		}

		return `${sem_suffix(s)}`;
	})();
	$: study_level = localize(personalData.studyProgram.studyLevel, "name", currentLocale); 
	$: deptSecretaryEmail = personalData?.studyProgram.department.email;
	$: deptSecretaryPhone = personalData?.studyProgram.department.phone1;
	$: deptUrl = personalData?.studyProgram.department.url;
	$: academicId = personalData.academicId;

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
		{#if gender === 'Άντρας' || gender === 'Male'}
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
			<ion-item id="copyMessage" button={true} on:click={() => writeToClipboard(username)}>
				<ion-icon size="small" icon={allIonicIcons.person} />

				<ion-label class="ion-padding-start">{username}</ion-label>
			</ion-item>
		{/if}

		{#if schoolGraduated}
			<ion-item button={true} on:click={() => writeToClipboard(schoolGraduated)}>
				<ion-icon size="small" icon={allIonicIcons.school} />

				<ion-label class="ion-padding-start">{schoolGraduated}</ion-label>
			</ion-item>
		{/if}

		{#if apm}
			<ion-item button={true} on:click={() => writeToClipboard(apm)}>
				<ion-icon size="small" icon={allIonicIcons.idCard} />

				<ion-label class="ion-padding-start">{apm}</ion-label>
			</ion-item>
		{/if}

		{#if academicId}
			<ion-item button={true} on:click={() => writeToClipboard(academicId)}>
				<ion-icon size="small" icon={allIonicIcons.idCard} />

				<ion-label class="ion-padding-start">{academicId}</ion-label>
			</ion-item>
		{/if}

		{#if birthDate}
			<ion-item button={true} on:click={() => writeToClipboard(birthDate)}>
				<ion-icon size="small" icon={allIonicIcons.calendar} />

				<ion-label class="ion-padding-start">{birthDate}</ion-label>
			</ion-item>
		{/if}

		{#if email}
			<ion-item button={true} on:click={() => writeToClipboard(email)}>
				<ion-icon size="small" icon={allIonicIcons.mail} />

				<ion-label class="ion-padding-start">{email}</ion-label>
			</ion-item>
		{/if}

		{#if gender}
			<ion-item button={true} on:click={() => writeToClipboard(gender)}>
				<ion-icon size="small" icon={allIonicIcons.maleFemale} />
				<ion-label class="ion-padding-start">{gender}</ion-label>
			</ion-item>
		{/if}

		{#if semester}
			<ion-item button={true} on:click={() => writeToClipboard(semester)}>
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-label class="ion-padding-start">{semester}</ion-label>
			</ion-item>
		{/if}

		{#if study_level}
			<ion-item button={true} on:click={() => writeToClipboard(study_level)} lines="none">
				<ion-icon size="small" icon={allIonicIcons.book} />

				<ion-label class="ion-padding-start">{study_level}</ion-label>
			</ion-item>
		{/if}

		{#if departmentName}
			<ion-accordion-group class="accordion" expand="compact">
				<ion-accordion value="first">
					<ion-item slot="header" color="white" lines="full">
						<ion-icon size="small" icon={allIonicIcons.location} />
						<ion-label class="ion-padding-start">{departmentName}</ion-label>
					</ion-item>
					{#if deptSecretaryEmail}
						<div class="department-child" slot="content" on:click={() => writeToClipboard(deptSecretaryEmail)}>
							<ion-icon size="small" icon={allIonicIcons.mail} />
							<span class="department-text">{deptSecretaryEmail}</span>
						</div>
					{/if}
					{#if deptSecretaryPhone}
						<div class="department-child" slot="content" on:click={() => writeToClipboard(deptSecretaryPhone)}>
							<ion-icon size="small" icon={allIonicIcons.call} />
							<span class="department-text">{deptSecretaryPhone}</span>
						</div>
					{/if}
					{#if deptUrl}
						<div class="department-child" slot="content" on:click={() => writeToClipboard(deptUrl)}>
							<ion-icon size="small" icon={allIonicIcons.globe} />
							<span class="department-text">{deptUrl}</span>
						</div>
					{/if}
				</ion-accordion>
			</ion-accordion-group>
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

	ion-accordion-group {
		margin-top: 0.2rem;
	}

	.department-child {
		padding-top: 0.8rem;
		padding-bottom: 0.8rem;
		color: var(--app-color-primary-dark);
		cursor: pointer;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.department-child:hover {
		background-color: var(--ion-color-light);
	}

	.department-text {
		color: var(--app-color-primary-dark);
	}
</style>
