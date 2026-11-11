<script lang="ts">
	import type { Snippet } from 'svelte';
	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { home, homeOutline, restaurantOutline, restaurant, mapOutline, calendarClearOutline, calendarClear, map, statsChart, statsChartOutline } from 'ionicons/icons';
	import { onMount } from 'svelte';
	import initializeNotifications from '$lib/-notifications/core';
	import { webmailLoggedIn as webmailAuthenticated} from '$components/webmailLogin/userCredsFlagStore';
	import { handleChangedPermission } from '$lib/calendarNotifications/exactAlarmPermissionStore';

	let { children }: { children?: Snippet } = $props();

	let activeTab = $state('homepage');

	// Routes
	let restaurantIcon = $derived(activeTab === 'menu' ? restaurant : restaurantOutline);
	let mapIcon = $derived(activeTab === 'maps' ? map : mapOutline);
	let statsChartIcon = $derived(activeTab === 'grades' ? statsChart : statsChartOutline);
	let calendarIcon = $derived(activeTab === 'calendar' ? calendarClear : calendarClearOutline);
	let homeIcon = $derived(activeTab === "homepage" ? home : homeOutline);

	let bottomNav = $derived([
		{
			// WARNING: Translated labels cause race condition!!!!
			// label: $t('navigation.maps'),
			icon: mapIcon,
			tab: 'maps'
		},
		{
			// label: $t('navigation.club'),
			icon: restaurantIcon,
			tab: 'menu'
		},
		{
			// label: $t('navigation.home'),
			icon: homeIcon,
			tab: 'homepage'
		},
		{
			// label: $t('navigation.progress'),
			icon: statsChartIcon,
			tab: 'grades'
		},
		{
			// label: $t('navigation.calendar'),
			icon: calendarIcon,
			tab: 'calendar'
		}
	]);

	const handleTabChange = (event: any) => {
		activeTab = event.detail.tab;
	};

	const logsStuff = () => {};

	onMount(async ()=>{
		if ($webmailAuthenticated) {
			await initializeNotifications();
		}

		// reschedule calendar notifications if the exact alarm permission changes
		handleChangedPermission();
	});

</script>

<IonTabs tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={handleTabChange}>
	{@render children?.()}
</IonTabs>
