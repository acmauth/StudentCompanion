<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import type { IonicConfig } from "@ionic/core";
	import { nativeSettings } from './nativeSettings';
	import { Capacitor } from '@capacitor/core';
  	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';

	/* Call Ionic's setup routine */
	setupIonicBase();

	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';

	/* Call Ionic's setup routine, force mode to material for consistency */
	setupIonicBase({mode: 'md'});

	/* Check if running on mobile */
	const isMobile = Capacitor.isNativePlatform() && Capacitor.getPlatform() !== 'web';
	if (isMobile) {
		// Apply native settings
		nativeSettings();
	}

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
