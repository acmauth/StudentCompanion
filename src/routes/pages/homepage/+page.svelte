<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import { StatusBar, Style } from "@capacitor/status-bar";
	import Homepage from './homepage.svelte';
	import {onMount, onDestroy} from 'svelte';

	let init_style: Style;
	onMount(async () => {
		if (document.body.classList.contains('dark')) {
			init_style = Style.Dark;
			document.body.style.background = 'linear-gradient(to bottom, #0a0e17 0rem, #174ea6 12rem)';
		} else {
			init_style = Style.Light;
			document.body.style.background = 'linear-gradient(to bottom, #0a0e17 0rem, #174ea6 12rem)';
		}
		// document.body.style.background = 'linear-gradient(to bottom, #0a0e17 0, #174ea6 12rem, var(--ion-background-color, #f5f5f5) 12rem)';
		await StatusBar.setStyle({ style: Style.Dark });
	});

	onDestroy(async () => {
		document.body.style.background = '';
		await StatusBar.setStyle({ style: init_style });
	});
</script>

<ion-tab tab="homepage" >
    
    <StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>