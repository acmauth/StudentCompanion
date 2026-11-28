<script lang="ts">
	import StackedNav from "$common/stackedNav"
	import CalendarPage from './CalendarPage.svelte';
</script>
	
<ion-tab tab="calendar">
    
    <StackedNav root={CalendarPage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

