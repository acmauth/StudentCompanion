<script lang="ts">


import StackedNav from "$components/shared/StackedNav"
import Grades from '$components/grades/gradesPage.svelte';
</script>

<ion-tab tab="grades">
	<StackedNav root={Grades} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

