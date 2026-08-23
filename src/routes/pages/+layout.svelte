<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { home, homeOutline, restaurantOutline, restaurant, mapOutline, calendarClearOutline, calendarClear, map, statsChart, statsChartOutline } from 'ionicons/icons';
	import { onMount } from 'svelte';
	import initializeNotifications from '$lib/-notifications/core';
	import { webmailLoggedIn as webmailAuthenticated} from '$components/webmailLogin/userCredsFlagStore';
	import { handleChangedPermission } from '$lib/calendarNotifications/exactAlarmPermissionStore';
	import { t } from '$lib/i18n';

	// Routes
	$: restaurantIcon = activeTab === 'menu' ? restaurant : restaurantOutline;
	$: mapIcon = activeTab === 'maps' ? map : mapOutline;
	$: statsChartIcon = activeTab === 'grades' ? statsChart : statsChartOutline;
	$: calendarIcon = activeTab === 'calendar' ? calendarClear : calendarClearOutline;
	$: homeIcon = activeTab === "homepage" ? home : homeOutline;

	$: bottomNav = [
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
		
	];

	let activeTab = 'homepage';

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

	<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={handleTabChange}>
	<slot />
</IonTabs>
