<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
	import type { TaskItem } from './TaskItem';
	export let subject: TaskItem; 
</script>

<ion-card href="/" class="ion-padding">
	<ion-grid class="card">
		<ion-row>
			<ion-col>
				<p>{subject.dateTime}</p>
			</ion-col>
			<ion-col>
				<h2>{subject.title}</h2>
				<p>{subject.classroom}</p>
				<p>{subject.professor}</p>
			</ion-col>
		</ion-row>
	</ion-grid>
</ion-card>

<style>
	.card {
		display: flex;
		align-items: center;
		justify-content: start;
		padding: 0 1rem;
	}

	ion-card {
		transition: all ease-in-out 0.2s;
	}

	ion-card:active {
		transform: scale(0.95);
	}
</style>
