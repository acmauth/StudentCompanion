<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import Settings from '$components/personalInfo/settings.svelte';
</script>


<ion-tab tab="personalInfo">
	<ion-header collapse="condense" mode="ios">
		<ion-toolbar mode={Capacitor.getPlatform() != 'ios' ? 'md': undefined}>
		  <ion-title class="ion-padding-vertical" size="large">Πληροφορίες εφαρμογής</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content fullscreen={true}>
		<Settings />
	</ion-content>
</ion-tab>
	
<style>
	ion-content {
		--padding-end: 0.6rem;
		--padding-start: 0.6rem;
	}
</style>

