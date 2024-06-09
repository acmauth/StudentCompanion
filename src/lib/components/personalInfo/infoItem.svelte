<script lang="ts">
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';
	import * as allIonicIcons from 'ionicons/icons';
	import { Clipboard } from '@capacitor/clipboard';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';

	 export let gender: String;
	 gender = gender === 'Α' ? 'Άντρας' : 'Γυναίκα';
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
	 semester = `${semester}ο Εξάμηνο`;


	// Function to show toast
	 async function showToast(toast: ToastOptions){
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
						positionAnchor: "tab-button-homepage",
						cssClass: 'custom-toast'
					});
	};
</script>

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


			{#if departmentName}
			<ion-item button="true" on:click={writeToClipboard(departmentName)}>
				<ion-icon size="small" icon={allIonicIcons.location} />

				<ion-label class="ion-padding-start">{departmentName}</ion-label>
			</ion-item>
			{/if}

			{#if semester}
			<ion-item button="true" on:click={writeToClipboard(semester)} lines="none">
				<ion-icon size="small" icon={allIonicIcons.analytics} />

				<ion-label class="ion-padding-start">{semester}</ion-label>
			</ion-item>
			{/if}



	</ion-card>
	



<style>
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ion-icon {
		color: var(--app-color-primary-dark);
	}


	ion-card-subtitle {
		font-size: 1.2rem;
		padding-left: 5px;
	}

	[data-theme="dark"] ion-icon {
		color: rgba(85, 187, 255, 1);
	}

</style>