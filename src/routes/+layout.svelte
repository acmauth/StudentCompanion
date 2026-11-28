<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import type { IonicConfig } from '@ionic/core';
	import { nativeSettings } from '$methods/app/nativeSettings';
	import { Capacitor } from '@capacitor/core';
	import { addNetworkListener } from '$methods/app/offlineHandling';
	import { checkAppMode } from '$methods/app/darkMode';
	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';

	/* Call Ionic's setup routine, force mode to material for consistency */
	setupIonicBase({ mode: 'md' });

	/* Check if running on mobile */
	const isMobile = Capacitor.isNativePlatform() && Capacitor.getPlatform() !== 'web';
	checkAppMode();
	if (isMobile) {
		// Apply native settings
		nativeSettings();
	}

	addNetworkListener();

	/* Theme variables */
	import '$src/theme/variables.css';
	import { onMount } from 'svelte';
</script>

<ion-app>
	<slot />
</ion-app>
