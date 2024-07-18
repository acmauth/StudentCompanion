<script lang="ts">

import IonNav from 'ionic-svelte/components/IonNav.svelte'
import Grades from '$components/grades/gradesPage.svelte';
</script>

<ion-tab tab="grades">
	<IonNav root={Grades} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

