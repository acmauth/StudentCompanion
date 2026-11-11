<script lang="ts">
	import VectorGreece from '$components/language/Greece.svg';
	import VectorUK from '$components/language/UK.svg';
	import { navController } from '$components/shared/StackedNav';
	import { webmailLoggedIn } from '$components/webmailLogin/userCredsFlagStore';
	import { userCreds } from '$stores/credentials.store';
	import CredentialLoginItem from '$components/webmailLogin/CredentialLoginItem.svelte';
	import cog_solid from '$customIcons/cog-solid.svg';
	import launchNativenotificationSettings from '$lib/functions/nativeSettings/launchNotificationSettings';
	import { checkAppMode, toggleDarkTheme } from '$lib/globalFunctions/darkMode';
	import { changeLocale, locale, t } from '$lib/i18n';
	import { Capacitor } from '@capacitor/core';
	import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
	import type { ToastOptions } from '@ionic/core';
	import Dexie from 'dexie';
	import { toastController } from 'ionic-svelte';
	import * as allIonicIcons from 'ionicons/icons';
	import { onMount } from 'svelte';
	import About from './about.svelte';
	import Faq from './faq.svelte';
	import { darkMode } from '$lib/globalFunctions/darkMode';

	
	interface Props {
		logOut: any;
	}

	let { logOut }: Props = $props();

	onMount(() => {
		checkAppMode();
	});

	function toggleLanguage() {
		const nextLang = $locale === 'el' ? 'en' : 'el';
		document.cookie = `lang=${nextLang};`; // for some reason, homepage will go to default locale without this line.
		changeLocale(nextLang);
	}

	async function showToast(toast: ToastOptions) {
		const toast_ = await toastController.create(toast);
		toast_.present();
	}


	function logoutWebmail(){
		// Clear stored credentials
		userCreds.set({ username: '', password: '' });
        webmailLoggedIn.set(false);
		
	}
</script>

<ion-card>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<ion-card-content>
		<ion-item>
			<ion-icon size="small" icon={allIonicIcons.brush}></ion-icon>
			<ion-toggle
				id="themeToggle"
				class="ion-padding-start"
				checked={$darkMode}
				onionChange={async () => await toggleDarkTheme()}
			>
				Dark Mode
			</ion-toggle>
		</ion-item>

		<CredentialLoginItem />

		{#if Capacitor.isNativePlatform()}
			<ion-item button onclick={launchNativenotificationSettings} aria-hidden>
				<ion-icon size="small" icon={cog_solid}></ion-icon>
				<ion-label class="ion-padding-start">{$t('settings.notifications')}</ion-label>
				<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} aria-hidden></ion-icon>
			</ion-item>
		{/if}

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<ion-item button onclick={toggleLanguage}>
			<ion-icon size="small" icon={allIonicIcons.language}></ion-icon>
			<ion-label class="ion-padding-start">{$t('settings.language')}</ion-label>
			<img
				class="language-flag"
				src={$locale === 'el' ? VectorGreece : VectorUK}
				alt={$locale === 'el' ? 'Ελληνικά' : 'English'}
				slot="end"
			/>
		</ion-item>

		<ion-item button href=""  onclick={() => {navController.push(About)}} aria-hidden>
			<ion-icon size="small" icon={allIonicIcons.people}></ion-icon>
			<ion-label class="ion-padding-start">{$t('settings.about')}</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle}></ion-icon>
		</ion-item>

		<ion-item button href="" onclick={() => {navController.push(Faq)}} aria-hidden>
			<ion-icon size="small" icon={allIonicIcons.helpCircle}></ion-icon>
			<ion-label class="ion-padding-start">FAQ</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle}></ion-icon>
		</ion-item>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- <ion-item button on:click={updateButton}>
			<ion-icon size="small" icon={allIonicIcons.syncCircle} />
			<ion-label class="ion-padding-start">{$t('update.updateButton')}</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item> -->

		{#if $webmailLoggedIn}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<ion-item button onclick={logoutWebmail}>
				<ion-icon color="warning" size="small" icon={allIonicIcons.logOut}></ion-icon>
				<ion-label color="warning" class="ion-padding-start">{$t('settings.webmailLogout')}</ion-label>
				<ion-icon color="warning" size="small" icon={allIonicIcons.chevronForwardCircle}></ion-icon>
			</ion-item>
		{/if}

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<ion-item button lines="none" onclick={logOut}>
			<ion-icon color="danger" size="small" icon={allIonicIcons.exit}></ion-icon>

			<ion-label color="danger" class="ion-padding-start">{$t('settings.logout')}</ion-label>
			<ion-icon color="danger" size="small" icon={allIonicIcons.chevronForwardCircle}></ion-icon>
		</ion-item>
	</ion-card-content>
</ion-card>

<style>
	ion-icon {
		color: var(--app-color-icons);
	}

	.language-flag {
		width: 28px;
		height: 20px;
		object-fit: cover;
		border-radius: 0.25rem;
	}
</style>
