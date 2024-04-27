<script lang="ts">
  	import IonTabs from '$lib/components/shared/AristomateTabBar.svelte';
	import { calendar, home, notifications, personCircle, statsChart, notificationsOutline, calendarClear, calendarClearOutline } from 'ionicons/icons';
	import notif from "$customIcons/notif.svg";
	import home_solid from "$customIcons/home-solid.svg";
	import chart_pie_solid from "$customIcons/chart-pie-solid.svg";
	import user_solid from "$customIcons/user-solid.svg";
	import chat_bubble_left_right_solid from "$customIcons/chat-bubble-left-right-solid.svg";
	import bell_alert_solid from "$customIcons/bell-alert-solid.svg";
	import book_open_solid from "$customIcons/book-open-solid.svg";
	import chart_bar_solid from "$customIcons/chart-bar-solid.svg";
	import chart_bar from "$customIcons/chart-bar.svg";
	import { onMount } from 'svelte';
	import initializeNotifications from '$lib/-notifications/core';
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
		await initializeNotifications();
	});

</script>

<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
	<slot />
</IonTabs>
