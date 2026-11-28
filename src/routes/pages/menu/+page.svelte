<script lang="ts">
	import StackedNav from "$common/stackedNav"
	import Menu from './MenuPage.svelte';
</script>

<ion-tab tab="menu">
	<StackedNav root={Menu} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>
	