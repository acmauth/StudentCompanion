<script>
	import { setupIonicBase } from 'ionic-svelte';
  import IonTabs from 'ionic-svelte/components/IonTabs.svelte';

	/* Call Ionic's setup routine */
	setupIonicBase();

	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';

	/* Theme variables */
	import '../theme/variables.css';

  /* Needed ion icons for the router */  
	import { calendar, home, notifications, personCircle, statsChart } from 'ionicons/icons'; 

  // Routes 
	const bottomNav = [
		{
			label: 'Home',
			icon: home,
			tab: 'homepage'
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
	<IonTabs slot="bottom" tabs={bottomNav} ionTabsWillChange={logsStuff} ionTabsDidChange={logsStuff}>
		<slot />
	</IonTabs>
</ion-app>
