<script lang="ts">
	import {timeOutline, map} from 'ionicons/icons';
	import type { ExamItem } from './ExamItem';
	import type { IonCard } from '@ionic/core/components/ion-card';
	import { onMount } from 'svelte';
	export let examItem: ExamItem;

	onMount(() => {
		const today = new Date();
		const date1 = new Date(today.getFullYear() + '-' + examItem.date.monthDate.split("/")[1] + '-' + examItem.date.monthDate.split("/")[0]+ ' ' + examItem.date.startTime);
		const diffTime = today.getTime() - date1.getTime();
		console.log(date1);
		if (diffTime > 0) {	
			let card = document.getElementById(examItem.subject) as IonCard;
			card.color = "light";
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-card id={examItem.subject}>
	<ion-grid>
		<ion-row class="ion-justify-content-start">
			<ion-col style="padding: 0%">
				<ion-card-header>
					<ion-card-title class="title" color="primary">{examItem.subject}</ion-card-title>

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

<ion-toast trigger={examItem.subject} message={examItem.subject} duration={2000}  position="bottom" class="circular-toast" color="light" style="text-align: center;"></ion-toast>



<style>
	ion-card {
		transition: all ease-in-out 0.2s;
	}

	ion-card:active {
		transform: scale(0.95);
	}

	.circular-toast {
        --border-radius: 20px;
		--box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    }

	.icons {
		display: flex;
		gap: 0.5rem;
		padding-top: 2%;
		align-items: center;
	}

	.title {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
