<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import type { course } from './courseType';
	export let subject: course;
</script>

<ion-card href="/" class="ion-padding">
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col class="ion-no-padding" size-md="10" size-lg="8" size-xl="6">
				<ion-card-header>
					<ion-card-title class="ion-padding-bottom">{subject.courseTitle}</ion-card-title>

					<div class="icons">
						<ion-icon icon={allIonicIcons.flagOutline} />
						<ion-card-subtitle>{subject.course}</ion-card-subtitle>
					</div>

					<div class="icons">
						<ion-icon icon={allIonicIcons.personOutline} />
						<ion-card-subtitle>Nikolaos Tsitsas</ion-card-subtitle>
					</div>
				</ion-card-header>
			</ion-col>

			<ion-col size="20">
				<ion-card-content class="ion-text-center">
					{#if subject.grade !== null}
						<ion-text color="success">
							<h2>{subject.formattedGrade}</h2>
						</ion-text>
					{:else}
						<p>Ungraded</p>
					{/if}
				</ion-card-content>
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
		align-items: center;
	}
</style>
