<script lang="ts">
	import { goto } from '$app/navigation';
	import { judgeAuth } from '$lib/authentication/authValidator';
	import { onMount } from 'svelte';
	import Logo from '$lib/assets/Logo_full.png';
	import { neoUniversisGet } from '$lib/dataService';
	import { loadPersistedStores } from './persistedStoreDeclarations';
	import initializeNotifications from '$lib/-notifications/core';
	
	function delay(ms: number) {
 	   return new Promise( resolve => setTimeout(resolve, ms) );
	}

	async function preFlightCache(){
		await neoUniversisGet('Students/me/');
		await neoUniversisGet('students/me/courses?$top=-1');
	}

	// Handling the redirect to the homepage
	onMount(async () => {
		await loadPersistedStores();
		await delay(1000);
		if (await judgeAuth()) {
			await preFlightCache();
			await initializeNotifications();
			goto('pages/homepage');
		} else {
			goto('login');}
		}
	);
</script>
   
<ion-grid class="ion-text-center center-grid">
	<img src={Logo} alt="Aristomate logo" class="pop-up-image" style="width: 80%">
	<br>
    <ion-spinner name="dots" color="secondary" style="scale: 150%;"/>
</ion-grid>


<style>
	ion-grid {
		&.center-grid {
			position: absolute;
			top: 35%;
			display: block !important;
			width: 100%;
		}
    }
	.pop-up-image {
		transition: all ease-in-out 0.2s;
	}
</style>

