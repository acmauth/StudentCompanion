<script>
	import { setupIonicBase } from 'ionic-svelte';
	import { App as capacitorApp } from '@capacitor/app';
	/* Import all components - or do partial loading - see below */
	import 'ionic-svelte/components/all';

	/* Call Ionic's setup routine */
	setupIonicBase();

	/* Capacitor back button handling */
	capacitorApp.addListener('backButton', ({canGoBack}) => {
		if(!canGoBack){
			capacitorApp.exitApp();
		} else {
			window.history.back();
		}
	});
	/* Theme variables */
	import '../theme/variables.css';



</script>

<ion-app>
	<slot />
</ion-app>
