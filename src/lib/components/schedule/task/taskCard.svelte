<script lang="ts">
	import {documentText, star} from 'ionicons/icons';
	import { TaskType, type TaskItem } from './TaskItem';
	import { getDayByIndex } from '../day/days';
	import {timeOutline, map} from 'ionicons/icons';
	import { onMount } from 'svelte';
	
	export let taskItem: TaskItem;
	
	let startDay: string = getDayByIndex(new Date(taskItem.date.startDate).getDay(), 'el', true); 
	let endDay: string = getDayByIndex(new Date(taskItem.date.endDate).getDay(), 'el', true);
	let isPastDate: boolean = false;
	let isTest: boolean = false;
	let isProject: boolean = false;

	onMount(async() => {
		isPastDate = new Date().getTime() > new Date(taskItem.date.endDate).getTime();
		isTest = taskItem.type == TaskType.TEST;
		isProject = taskItem.type == TaskType.PROJECT;
	});
</script>

<style>
	@import '../ScheduleCard.css';
	.pastDate {
        opacity: 0.5;
    }
	.test {
		--background: var(--ion-color-warning);
	}
	.project {
		--background: var(--ion-color-secondary);
	}
</style>

<ion-card href={`/tasks/editTask/${taskItem.id}`} class="card {isPastDate? 'pastDate' : null} {isTest? 'test' : null} {isProject? 'project' : null}" style="padding: 10px;">
	<ion-grid>
		<ion-row>
			{startDay} &nbsp;
			<span>{new Date(taskItem.date.startDate).toLocaleTimeString().split(':')[0] + ':' + new Date(taskItem.date.startDate).toLocaleString().split(':')[1]}</span>
			&nbsp; - &nbsp;
			{#if endDay != startDay} 
				<div class="day">{endDay}</div> &nbsp; 	
			{/if}
			<span>{new Date(taskItem.date.endDate).toLocaleTimeString().split(':')[0] + ':' + new Date(taskItem.date.endDate).toLocaleTimeString().split(':')[1]}</span>
		</ion-row>
			<ion-row class="ion-align-items-center ion-justify-content-start">
			<ion-card-header>
				<ion-card-title color="primary">{taskItem.title}</ion-card-title>
				<div class="icons">
					<ion-icon icon={documentText} />
					<ion-card-subtitle>{taskItem.description}</ion-card-subtitle>
				</div>
			</ion-card-header>
		</ion-row>
	</ion-grid>
</ion-card>
