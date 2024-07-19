<script lang="ts">

import IonNav from 'ionic-svelte/components/IonNav.svelte'
import AristomateNav from '$src/routes/test/AristomateNav.svelte';
import Grades from '$components/grades/gradesPage.svelte';
</script>

<ion-tab tab="grades">
	<AristomateNav root={Grades} animation={undefined} rootParams={undefined} swipeGesture={undefined}/>
</ion-tab>

