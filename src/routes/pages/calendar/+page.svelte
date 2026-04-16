<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import CalendarPage from './calendarPage.svelte';
</script>
	
<ion-tab tab="calendar">
    
    <StackedNav root={CalendarPage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

