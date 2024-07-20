<script lang="ts">


// import AristomateNav from '$components/shared/AristomateNav.svelte';
import StackedNav from "$components/shared/StackedNav"
import Grades from '$components/grades/gradesPage.svelte';
</script>

<ion-tab tab="grades">
	<StackedNav root={Grades} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

