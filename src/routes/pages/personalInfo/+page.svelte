<script lang="ts">
	import StackedNav from "$components/shared/StackedNav"
	import PersonalInfoPage from './personalInfo.svelte';
</script>
	
	<ion-tab tab="personalInfo">
		
		<StackedNav root={PersonalInfoPage} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
	</ion-tab>
	
	