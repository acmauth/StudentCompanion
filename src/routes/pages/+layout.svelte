<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { restaurant, calendarClear, map, statsChart } from 'ionicons/icons';
	import home_solid from "$customIcons/home-solid.svg";
	import user_solid from "$customIcons/user-solid.svg";
	import chart_bar_solid from "$customIcons/chart-bar-solid.svg";
	import { onMount } from 'svelte';
	import initializeNotifications from '$lib/-notifications/core';
	import { webmailLoggedIn as webmailAuthenticated} from '$components/webmailLogin/userCredsFlagStore';
	import { handleChangedPermission } from '$lib/calendarNotifications/exactAlarmPermissionStore';
	import { t } from '$lib/i18n';


	// Routes
	$: bottomNav = [
		{
			label: $t('navigation.maps'),
			icon: map,
			tab: 'maps'
		},
		{
			label: $t('navigation.club'),
			icon: restaurant,
			tab: 'menu'
		},
		{
			label: $t('navigation.home'),
			icon: home_solid,
			tab: 'homepage'
		},
		{
			label: $t('navigation.progress'),
			icon: statsChart,
			tab: 'grades'
		},
		{
			label: $t('navigation.calendar'),
			icon: calendarClear,
			tab: 'calendar'
		}
		
	];

	const logsStuff =()=>{};

	onMount(async ()=>{
		if ($webmailAuthenticated) {
			await initializeNotifications();
		}

		// reschedule calendar notifications if the exact alarm permission changes
		handleChangedPermission(); 
		});

</script>

<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
	<slot />
</IonTabs>
