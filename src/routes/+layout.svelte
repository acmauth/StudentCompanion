<script lang="ts">
	import { setupIonicBase } from 'ionic-svelte';
	import type { IonicConfig } from "@ionic/core";
	import { nativeSettings } from './nativeSettings';
	import { Capacitor } from '@capacitor/core';
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
	
</script>

<ion-app>
	<slot />
</ion-app>
