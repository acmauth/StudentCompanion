<script lang="ts">
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { neoUniversisGet } from '$lib/dataService';
	import { t } from '$lib/i18n';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import PersonSkeleton from './personSkeleton.svelte';
	import Settings from './settings.svelte';
	import SubPageHeader from '$components/shared/subPageHeader.svelte';
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	import { Clipboard } from '@capacitor/clipboard';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';

	interface PersonalInfo {
		aem: string;
		apm: string;
		inscriptionYear: string;
		birthDate: string;
		email: string;
		familyName: string;
		givenName: string;
		username: string;
		gender: string;
		departmentName: string;
		semester: string;
		study_level: string;
	}

	// Keep personal info

	let info: PersonalInfo | undefined;

	$: gender = info?.gender === 'Α' ? 'Άντρας' : 'Γυναίκα';
	$: semester = info ? `${info.semester}ο Εξάμηνο` : '';
	$: ({ aem, apm, birthDate, email, familyName, givenName, username, departmentName, study_level } =
		info ?? ({} as PersonalInfo));

	// Get personal details and department details

	async function getPersonalInfo() {
		let personalData = await neoUniversisGet(
			'Students/me?$expand=studyProgram($expand=studyLevel), department',
			{ lifetime: 86000 }
		);

		let user = await neoUniversisGet('Users/me', { lifetime: 86000 });
		info = {
			aem: personalData.studentIdentifier,
			apm: personalData.uniqueIdentifier,
			inscriptionYear: personalData.inscriptionYear.name,
			birthDate: personalData.person.birthDate.slice(0, 10),
			email: personalData.person.email,
			username: user.name,
			familyName: personalData.person.familyName,
			givenName: personalData.person.givenName,
			gender: personalData.person.gender,
			departmentName: personalData.department.name,
			semester: personalData.semester,
			study_level: personalData.studyProgram.studyLevel.name
		};
	}

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

<IonPage>
	<SubPageHeader title={$t('settings.personal')} stackedNav />
	<ion-content fullscreen={true}>

		{#await getPersonalInfo()}
			<PersonSkeleton />
		{:then}
			<ion-card class="ion-padding">
				<ion-card-header class="ion-text-center info">
					{#if gender === 'Άντρας'}
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
					{#if departmentName}
						<ion-item button="true" on:click={writeToClipboard(departmentName)}>
							<ion-icon size="small" icon={allIonicIcons.location} />

							<ion-label class="ion-padding-start">{departmentName}</ion-label>
						</ion-item>
					{/if}

					{#if username}
						<ion-item id="copyMessage" button="true" on:click={writeToClipboard(username)}>
							<ion-icon size="small" icon={allIonicIcons.person} />

							<ion-label class="ion-padding-start">{username}</ion-label>
						</ion-item>
					{/if}

					{#if apm}
						<ion-item button="true" on:click={writeToClipboard(apm)}>
							<ion-icon size="small" icon={allIonicIcons.idCard} />

							<ion-label class="ion-padding-start">{apm}</ion-label>
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

					{#if gender}
						<ion-item button="true" on:click={writeToClipboard(gender)}>
							<ion-icon size="small" icon={allIonicIcons.maleFemale} />

							<ion-label class="ion-padding-start">{gender}</ion-label>
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
		{:catch error}
			<ErrorLandingCard errorMsg={error.message} />
		{/await}
		<Settings />
	</ion-content>
</IonPage>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}

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
