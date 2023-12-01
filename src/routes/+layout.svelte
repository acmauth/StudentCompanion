<script>
	import { setupIonicBase } from 'ionic-svelte';
	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';

	/* Call Ionic's setup routine */
	setupIonicBase();

	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';
	import { calendar, home, notifications, personCircle, statsChart } from 'ionicons/icons';

	/* Theme variables */
	// import '../theme/variables.css';
	
	// Routes 
	const bottomNav = [
		{
			label: 'Home',
			icon: home,
			tab: 'home'
		},
		{
			label: 'Schedule',
			icon: calendar, 
			tab: 'schedule'
		},
		{
			label: 'Grades',
			icon: statsChart, 
			tab: 'grades'
		},
		{
			label: 'Notifications',
			icon: notifications,
			tab: 'notifications'
		},
		{
			label: 'Me',
			icon: personCircle,
			tab: 'personalInfo'
		}
	];

	const logsStuff =()=>{}; 
</script>

<ion-app>
	<!-- Bottom navigation Router -->
	<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
		<slot />
	</IonTabs>
</ion-app>
