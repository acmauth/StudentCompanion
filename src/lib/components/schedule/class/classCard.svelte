<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import { activeClass } from './activeClass'
	import type { ClassItem } from './ClassItem'
	export let classCourse: ClassItem;
	export let start: string;
	export let end: string;

	function setActiveclassCourse() {
		activeClass.set(classCourse);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-card href="/schedule/editSubject" class="card" on:click={setActiveclassCourse}>
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col style="padding: 0%">
				<ion-card-header>
					<ion-card-subtitle>{start + " - " + end}</ion-card-subtitle>
					<ion-card-title color="primary">{classCourse.title}</ion-card-title>

					<div class="icons">
						<ion-icon icon={allIonicIcons.personOutline} />
						<ion-card-subtitle>{classCourse.professor}</ion-card-subtitle>
					</div>

					<div class="icons">
						<ion-icon icon={allIonicIcons.map} />
						<ion-card-subtitle>{classCourse.classroom}</ion-card-subtitle>
					</div>
				</ion-card-header>
			</ion-col>
		</ion-row>
	</ion-grid>
</ion-card>



<style>
	.card {
		display: flex;
		align-items: center;
		justify-content: start;
	}

	ion-card {
		transition: all ease-in-out 0.2s;
	}

	ion-card:active {
		transform: scale(0.95);
	}

	.icons {
		display: flex;
		gap: 0.5rem;
		padding-top: 2%;
		align-items: center;
	}
</style>
