<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import Chips from '$components/homepage/notifications/NotificationChips.svelte';
	import { gatherNotifications } from '$services/notifications/notifications';
	import Notification from '$components/homepage/notifications/Notification.svelte';
	import { toggles } from '$components/homepage/notifications/notificationToggles';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import NotifSkeleton from '$components/homepage/notifications/NotifSkeleton.svelte';
	import ErrorLandingCard from '$common/ErrorLandingCard.svelte';
	import AppCard from '$common/AppCard.svelte';
	import cog from '$assets/common/icons/cog-outline.svg';
	import launchNativenotificationSettings from '$methods/app/launchNotificationSettings';
	import WebmailPlaceholder from '$components/homepage/notifications/WebmailPlaceholder.svelte';
	import { t } from '$methods/i18n';
	import SubPageHeader from '$common/SubPageHeader.svelte';

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
