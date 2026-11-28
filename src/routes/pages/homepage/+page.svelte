<script lang="ts">
	import StackedNav from "$common/stackedNav"
	import Homepage from './HomePage.svelte';
</script>

<ion-tab tab="homepage" >
    <StackedNav root={Homepage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>
