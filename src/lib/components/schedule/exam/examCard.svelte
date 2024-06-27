<style>
	@import '../ScheduleCard.css';
	.pastDate {
        opacity: 0.5;
    }
</style>

<script lang="ts">
	import {timeOutline, map} from 'ionicons/icons';
	import type { ExamItem } from './ExamItem';
	import { onMount } from 'svelte';
	export let examItem: ExamItem;
	
	let isPastDate: boolean = false;

	onMount(async() => {
		const examDate = new Date(new Date(new Date().getFullYear() + '-' + examItem.date.monthDate.split("/")[1] + '-' + examItem.date.monthDate.split("/")[0]+ ' ' + examItem.date.startTime));
		isPastDate = new Date().getTime() > examDate.getTime();
	});
</script>

<ion-card href="/courses/{examItem.id}" class="{isPastDate? 'pastDate' : null} examCard" style="padding: 0.5rem; margin: 0;">
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col class="ion-no-padding">
				<ion-card-header class="examCardHeader">
					<ion-card-title class="title">{examItem.subject}</ion-card-title>

					<div class="icons">
						<ion-icon icon={timeOutline} />
						<ion-card-subtitle>{examItem.date.weekDay} {examItem.date.monthDate}, {examItem.date.startTime} - {examItem.date.endTime}</ion-card-subtitle>
					</div>

					<div class="icons">
						<ion-icon icon={map} />
						<ion-card-subtitle>{examItem.classroom}</ion-card-subtitle>
					</div>
				</ion-card-header>
			</ion-col>
		</ion-row>
	</ion-grid>
</ion-card>
