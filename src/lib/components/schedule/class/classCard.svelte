<script lang="ts">
	import {personOutline, map} from 'ionicons/icons';
	import type { ClassItemFlat} from './ClassItem'
	export let classItem: ClassItemFlat;
</script>


<ion-card href={`/schedule/classes/editClass/${classItem.id}`} class="card">
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col style="padding: 0%">
				<ion-card-header>
					<ion-card-subtitle>{classItem.startTime + " - " + classItem.endTime}</ion-card-subtitle>
					<ion-card-title color="primary">{classItem.title}</ion-card-title>

					<div class="icons">
						<ion-icon icon={personOutline} />
						<ion-card-subtitle>{classItem.professor}</ion-card-subtitle>
					</div>

					<div class="icons">
						<ion-icon icon={map} />
						<ion-card-subtitle>{classItem.classroom}</ion-card-subtitle>
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

	ion-card-header {
		padding: 10px;
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
