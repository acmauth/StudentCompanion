<script lang="ts">
	import man from '$lib/assets/man.svg';
	import woman from '$lib/assets/woman.svg';
	import universityLogo from '$lib/assets/auth_white.png';
	import { businessOutline, personOutline, idCardOutline, fingerPrintOutline, schoolOutline, calendarOutline, mailOutline, maleFemaleOutline, layersOutline, libraryOutline, copyOutline } from 'ionicons/icons';
	import { Clipboard } from '@capacitor/clipboard';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import { t } from '$lib/i18n';

	export let gender: String;
	export let inscriptionYear: String;
	export let username: String;
	export let familyName: String;
	export let givenName: String;
	export let aem: String;
	export let apm: String;
	export let birthDate: String;
	export let email: String;
	export let departmentName: String;
	export let semester: String;
	export let study_level: String;

	$: semesterLabel = semester //? `${semester}` : '';

	type InfoField = { icon?: string; image?: string; label: string; value: String; copyable?: boolean };

	$: rows = (
		[
			[{ image: universityLogo, label: $t('homepage.institution'), value: $t('homepage.university') }],
			[{ icon: fingerPrintOutline, label: $t('homepage.apm'), value: apm, copyable: true }],
			[
				{ icon: idCardOutline, label: $t('homepage.aem'), value: aem, copyable: true },
				{ icon: libraryOutline, label: $t('homepage.studyLevel'), value: study_level }
			],
			[{ icon: businessOutline, label: $t('homepage.department'), value: departmentName }],
			[
				{ icon: layersOutline, label: $t('homepage.semester'), value: semesterLabel },
				{ icon: schoolOutline, label: $t('homepage.enrollmentYear'), value: inscriptionYear }
			],
			[{ icon: mailOutline, label: $t('homepage.email'), value: email, copyable: true }],
			// [{ icon: calendarOutline, label: $t('homepage.birthDate'), value: birthDate }]
		] as InfoField[][]
	)
		.map((row) => row.filter((field) => !!field.value))
		.filter((row) => row.length > 0);

	async function showToast(toast: ToastOptions) {
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

	const writeToClipboard = async (info: String) => {
		await Clipboard.write({
			string: info as string
		});

		showToast({
			duration: 2000,
			message: $t('homepage.copiedToClipboard'),
			mode: 'ios',
			layout: 'stacked',
			positionAnchor: 'tab-button-homepage',
			cssClass: 'custom-toast'
		});
	};
</script>

<ion-card class="profile-card">
	<div class="profile-header">
		{#if gender === 'Α'}
			<img class="avatar" alt="man" src={man} />
		{:else}
			<img class="avatar" alt="woman" src={woman} />
		{/if}
		<div class="profile-heading">
			<span class="profile-name">{givenName} <br/> {familyName}</span>
		</div>
	</div>

	<div class="profile-list">
		{#each rows as row}
			<div class="profile-row-group">
				{#each row as field}
					{#if field.copyable}
						<div class="profile-row ion-activatable" role="button" tabindex="0" on:click={() => writeToClipboard(field.value)} on:keydown={(e) => e.key === 'Enter' && writeToClipboard(field.value)}>
							<div class="profile-row-icon">
								{#if field.image}
									<img src={field.image} alt="" class="profile-row-logo" />
								{:else}
									<ion-icon icon={field.icon} />
								{/if}
							</div>
							<div class="profile-row-text">
								{#if field.label}
									<span class="profile-row-label">{field.label}</span>
								{/if}
								<span class="profile-row-value">{field.value}</span>
							</div>
							<ion-icon class="profile-row-copy" icon={copyOutline} />
							<ion-ripple-effect />
						</div>
					{:else}
						<div class="profile-row">
							<div class="profile-row-icon">
								{#if field.image}
									<img src={field.image} alt="" class="profile-row-logo" />
								{:else}
									<ion-icon icon={field.icon} />
								{/if}
							</div>
							<div class="profile-row-text">
								{#if field.label}
									<span class="profile-row-label">{field.label}</span>
								{/if}
								<span class="profile-row-value">{field.value}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</ion-card>

<style>
	.profile-card {
		margin: 0.6rem;
		border-radius: 1.1rem;
		box-shadow: none;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 1.1rem 1.1rem 0.4rem 1.1rem;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		padding: 0.4rem;
		flex-shrink: 0;
	}

	.profile-heading {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.profile-name {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ion-text-color);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.profile-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.4rem 1rem 1rem 1rem;
	}

	.profile-row-group {
		display: flex;
		gap: 0.4rem;
	}

	.profile-row {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 0.75rem;
		border-radius: 0.85rem;
		background: var(--ion-color-step-100);
		overflow: hidden;
		min-width: 0;
		flex: 1;
	}

	.profile-row.ion-activatable {
		cursor: pointer;
	}

	.profile-row-icon {
		flex-shrink: 0;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--ion-color-primary);
		color: var(--ion-color-primary-contrast);
		font-size: 1.05rem;
		overflow: hidden;
	}

	.profile-row-logo {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 0.2rem;
	}

	.profile-row-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.profile-row-label {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.3px;
		color: var(--ion-color-medium);
	}

	.profile-row-value {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--ion-text-color);
		overflow-wrap: break-word;
	}

	.profile-row-copy {
		flex-shrink: 0;
		font-size: 0.95rem;
		color: var(--ion-color-medium);
		opacity: 0.6;
	}
</style>
