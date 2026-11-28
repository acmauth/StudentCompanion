<script lang="ts">


import StackedNav from "$common/stackedNav"
import Grades from './GradesPage.svelte';
</script>

<ion-tab tab="grades">
	<StackedNav root={Grades} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

