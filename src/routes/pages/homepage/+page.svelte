<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import { StatusBar, Style } from "@capacitor/status-bar";
	import Homepage from './homepage.svelte';
	import {onMount, onDestroy} from 'svelte';
</script>

<ion-tab tab="homepage" >
    <StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>