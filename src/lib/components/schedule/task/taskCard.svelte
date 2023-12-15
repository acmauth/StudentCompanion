<script lang="ts">
	import {documentText} from 'ionicons/icons';
	import { activeTask } from './activeTask';
	import type { TaskItem } from './TaskItem';
	import { getDayByIndex } from '../day/days';

	export let task: TaskItem;

	function setActiveTask() {
		activeTask.set(task);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-card href="/schedule/tasks/editTask" class="card" on:click={setActiveTask}>
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col size="2">
				<div class="first-column">
				  <div class="day">{getDayByIndex(task.slot.day)}</div>
				  <div class="time">
					<span>{task.slot.timeStart}</span>
					<span>{task.slot.timeEnd}</span>
				  </div>
				</div>
			  </ion-col>
			<ion-col style="padding: 0%">
				<ion-card-header>
					<ion-card-title color="primary">{task.title}</ion-card-title>
					<div class="icons">
						<ion-icon icon={documentText} />
						<ion-card-subtitle>{task.description}</ion-card-subtitle>
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
		justify-content: center;
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

	.first-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		vertical-align: middle;
		padding: 0.5rem;	
  }

  .day {
		font-size: 1.5em; /* Adjust the font size as needed */
		font-weight: bold;
  }

  .time {
		font-size: 0.8em; /* Adjust the font size as needed */
		display: flex;
		flex-direction: column;
  }

</style>
