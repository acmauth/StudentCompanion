<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import { StatusBar, Style } from "@capacitor/status-bar";
	import Homepage from './homepage.svelte';
	import {onDestroy, onMount} from 'svelte';
	import { darkMode } from "$src/lib/globalFunctions/darkMode";
	import { get } from "svelte/store";
    import appConfig from '$src/app.config';

	onMount(async () => {
		if (appConfig.isMobile){
			await StatusBar.setStyle({ style: Style.Dark });
		}	
	})

	onDestroy(async () => {
		if (appConfig.isMobile){
			await StatusBar.setStyle({ style: get(darkMode)? Style.Dark : Style.Light });
			await StatusBar.show();
		}
	});

</script>

<ion-tab tab="homepage" >
    <StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>