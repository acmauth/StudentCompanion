<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import type { IonicConfig } from "@ionic/core";
	import { nativeSettings } from '$lib/globalFunctions/nativeSettings';
	import { Capacitor } from '@capacitor/core';
  	import IonTabs from 'ionic-svelte/components/IonTabs.svelte';
	import { addNetworkListener } from '$lib/globalFunctions/offlineHandling';
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

	addNetworkListener();

	/* Theme variables */
	import '../theme/variables.css';

  /* Needed ion icons for the router */  
	import { calendar, home, notifications, personCircle, statsChart } from 'ionicons/icons'; 

  // Routes 
	const bottomNav = [
		{
			label: '',
			icon: home,
			tab: 'homepage'
		},
		{
			label: '',
			icon: calendar, 
			tab: 'schedule'
		},
		{
			label: '',
			icon: statsChart, 
			tab: 'grades'
		},
		{
			label: '',
			icon: notifications,
			tab: 'notifications'
		},
		{
			label: '',
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
