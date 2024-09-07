<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { notifications, calendarClear } from 'ionicons/icons';
	import home_solid from "$customIcons/home-solid.svg";
	import user_solid from "$customIcons/user-solid.svg";
	import chart_bar_solid from "$customIcons/chart-bar-solid.svg";
	import { onMount } from 'svelte';
	import initializeNotifications from '$lib/-notifications/core';
	import initializeRefresherService from '$src/lib/-keycloakRefresher/core';
	import { userCredsFlag as webmailAuthenticated} from '$components/webmailLogin/userCredsFlagStore';

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
			icon: chart_bar_solid,
			tab: 'grades'
		},
		{
			label: '',
			icon: notifications,
			tab: 'notifications'
		},
		{
			label: '',
			icon: user_solid,
			tab: 'personalInfo'
		}
	];

	const logsStuff =()=>{};

	onMount(async ()=>{
		await initializeRefresherService();
		if ($webmailAuthenticated) {
			await initializeNotifications();
		}
	});

</script>

<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
	<slot />
</IonTabs>
