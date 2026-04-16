<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import Chips from './chips.svelte';
	import { gatherNotifications } from '../../lib/components/notifications/notifications';
	import Notification from '../../lib/components/notifications/notification.svelte';
	import { toggles } from './notificationToggles';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import NotifSkeleton from './notifSkeleton.svelte';
	import ErrorLandingCard from '$components/errorLanding/ErrorLandingCard.svelte';
	import AppCard from '$components/shared/AppCard.svelte';
	import cog from '$customIcons/cog-outline.svg';
	import launchNativenotificationSettings from '$lib/functions/nativeSettings/launchNotificationSettings';
	import WebmailPlaceholder from '$lib/components/webmailLogin/webmailplaceholderComponent/webmailPlaceholder.svelte';
	import { t } from '$lib/i18n';
	import SubPageHeader from '$components/shared/subPageHeader.svelte';

	let refresher: HTMLIonRefresherElement;
	let notificationsPromise = gatherNotifications();

	const refreshNotifications = async () => {
		notificationsPromise = gatherNotifications({ refresh: true });
		refresher.complete();
	};

	const randList = (length: number) => {
		const randomLength = Math.floor(Math.random() * length) + 2;
		return Array.from({ length: randomLength }, (_, i) => i + 1);
	};
</script>

<ion-content fullscreen={true}>
	<SubPageHeader title={$t('notifications.title')} stackedNav />
	
	<ion-header collapse="condense" mode="ios">
		<Chips />
	</ion-header>

	<ion-refresher slot="fixed" bind:this={refresher} on:ionRefresh={refreshNotifications}>
		<ion-refresher-content />
	</ion-refresher>

	{#await notificationsPromise}
		<ion-progress-bar type="indeterminate" />
		{#each randList(5) as rand (rand)}
			<NotifSkeleton />
		{/each}
	{:then notifications}
		<WebmailPlaceholder />
		{#each notifications as notification (notification.id)}
			<div animate:flip={{ duration: 500, easing: quintOut }}>
				{#if $toggles.all || ($toggles.webmail && notification.type === 'webmail') || ($toggles.universis && notification.type === 'universis') || ($toggles.elearning && notification.type === 'elearning')}
					<AppCard padding>
						<Notification {notification} />
					</AppCard>
				{/if}
			</div>
		{/each}
	{:catch error}
		<ErrorLandingCard errorMsg={error.message} />
	{/await}
</ion-content>

<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>
