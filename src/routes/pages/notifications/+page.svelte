<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import NotificationsPage from './notificationsPage.svelte';
</script>
	
<ion-tab tab="notifications">
    
    <StackedNav root={NotificationsPage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

