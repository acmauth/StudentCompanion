<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import { StatusBar, Style } from "@capacitor/status-bar";
	import Homepage from './homepage.svelte';
	import {onMount, onDestroy} from 'svelte';

	let init_style: Style;
	
	onMount(async () => {
		if (document.body.classList.contains('dark')) {
			init_style = Style.Dark;
		} else {
			init_style = Style.Light;
		}
		await StatusBar.setStyle({ style: Style.Dark });
	});

	onDestroy(async () => {
		await StatusBar.setStyle({ style: init_style });
		await StatusBar.show();
	});

</script>

<ion-tab tab="homepage" >
    <StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>