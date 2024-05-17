<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { calendar, home, notifications, personCircle, statsChart, notificationsOutline, calendarClear, calendarClearOutline, helpOutline } from 'ionicons/icons';
	import home_solid from "$customIcons/home-solid.svg";
	
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
			tab: 'schedule'
		},
		{
			label: '',
			icon: helpOutline,
			tab: 'personalInfo'
		}
	];

	const logsStuff =()=>{};


</script>

<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
	<slot />
</IonTabs>
