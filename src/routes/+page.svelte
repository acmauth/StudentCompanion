<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Logo from '$lib/assets/Logo_full.png';
	
	function delay(ms: number) {
 	   return new Promise( resolve => setTimeout(resolve, ms) );
	}
	onMount(async () => {
		await delay(500);
		goto('pages/homepage');
	});
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

