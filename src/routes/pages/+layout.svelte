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

	// Routes
	let bottomNav = [
		{
			label: '',
			icon: home_solid,
			tab: 'homepage'
		},
		{
			label: '',
			icon: calendarClear,
			tab: 'calendar'
		},
		{
			label: '',
			icon: statsChart,
			tab: 'grades'
		},
		{
			label: '',
			icon: map,
			tab: 'maps'
		},
		{
			label: '',
			icon: restaurant,
			tab: 'menu'
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
