<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import Homepage from './homepage.svelte';
</script>
	
	<ion-tab tab="homepage">
		
		<StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
	</ion-tab>
	
	