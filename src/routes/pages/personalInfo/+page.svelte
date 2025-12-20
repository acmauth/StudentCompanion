<script lang="ts">
	import { neoUniversisGet } from '$lib/dataService';
	import { invalidateAuth } from '$lib/authentication/authValidator';
	import { goto } from '$app/navigation';
	import InfoItem from '$lib/components/personalInfo/infoItem.svelte';
	import PersonSkeleton from '$components/personalInfo/personSkeleton.svelte';
	import { Capacitor } from '@capacitor/core';
	import Settings from '$components/personalInfo/settings.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import { userCredsFlag } from '$components/webmailLogin/userCredsFlagStore';
	import { t, locale, locales } from '$lib/i18n';
	import {onMount} from 'svelte'
	// Keep personal info
	// Get personal details and department details
	let personalData: any = null;
	let loading = true;
    let error: any = null;

    onMount(async () => {
        try {
            personalData = await neoUniversisGet(
                'Students/me?$expand=studyProgram($expand=studyLevel($expand=locale),department($expand=locale)),person($expand=locale)',
                { lifetime: 86000 }
            );
			console.log(personalData)
        } catch (err) {
            error = err;
        } finally {
            loading = false;
        }
    });

	// Log out
	function logOut() {
		invalidateAuth();
		console.log("[src/routes/pages/personalInfo/+page.svelte] Navigating to login");
		goto('/login');
	}
</script>

<ion-tab tab="personalInfo">
	<ion-header translucent={Capacitor.getPlatform() === 'ios'} mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
			<ion-title class="ion-padding-vertical" size="large">{$t('settings.personal')}</ion-title>
		</ion-toolbar>
	</ion-header>

	<ion-content fullscreen={true}>
		<ion-header collapse="condense" mode="ios">
			<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md' : undefined}>
				<ion-title size="large">{$t('settings.personal')}</ion-title>
			</ion-toolbar>
		</ion-header>

		{#if loading}
			<PersonSkeleton />
		{:else if error}
			<ErrorLandingCard errorMsg={error.message} />
		{:else}
			<InfoItem
				{personalData}
			/>
		{/if}
		<Settings {logOut} />
	</ion-content>
</ion-tab>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>
