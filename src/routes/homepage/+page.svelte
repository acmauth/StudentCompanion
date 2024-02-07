<script>
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import AppCard from '$shared/AppCard.svelte';
	import AppletsSlides from './appletsSlides.svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import { universisGet } from '$lib/dataService';
	import { onMount } from 'svelte';
	import { wallet } from 'ionicons/icons';
	import man from '$lib/assets/man.png';
	import woman from '$lib/assets/woman.png';

	let givenName = '';
	let gender = '';
	let passedSubjects = 0;
	let subjects = 0;
	let average = 0;

	onMount(async () => {
		let personalData = await universisGet('Students/me/');
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;

		subjects = (await universisGet('students/me/courses?$top=-1')).value;
		// @ts-ignore
		passedSubjects = subjects.filter(
			(/** @type {{ grade: number; }} */ course) => course.grade * 10 >= 5
		);
		averages().then((result) => {
			average = result.weighted_avg;
			let progressAvg = 0;
			console.log(average);
			let progressBarAvg = document.querySelector('.progress-avg');
			while (progressAvg < average / 10) {
				progressBarAvg.value = progressAvg += 0.01;
			}
		});
		// @ts-ignore
		subjects = subjects.length;
		// @ts-ignore
		passedSubjects = passedSubjects.length;

		let progressCourses = 0;
		let progressBarCourses = document.querySelector('.progress-courses');
		while (progressCourses < passedSubjects / subjects) {
			progressBarCourses.value = progressCourses += 0.01;
		}
	});
</script>

<IonPage>
	<ion-header>
		<ion-toolbar>
			<ion-title>Home</ion-title>
		</ion-toolbar>
	</ion-header>
	<ion-content class="" fullscreen>
		<div class="info-container">
			<div>
				{#if gender === 'Α'}
					<img class="avatar ion-padding-vertical" alt="man" src={man} width="200rem" />
				{:else}
					<img class="avatar ion-padding-vertical" alt="man" src={woman} width="200rem" />
				{/if}
			</div>
			<div>
				<h5 class="h5">Γεια σου</h5>
				<h5 class="h5"><b>{givenName}!</b></h5>
			</div>
			<div class="student-id">
				<AppCard margin={false} shadow={true} href="/id">
					<div style="background-color: #f3faff">
						<ion-icon class="id-icon" icon={wallet} />
					</div>
				</AppCard>
			</div>
		</div>
		<div class="card-container">
			<AppCard colour="primary" margin={false}>
				<div class="courses-passed">
					<ion-card-title><b> {passedSubjects}/{subjects} </b></ion-card-title>
					<ion-card-subtitle>Περασμένα</ion-card-subtitle>

					<ion-progress-bar class="progress-courses" />
				</div>
			</AppCard>

			<AppCard colour="primary" margin={false}>
				<div class="avg-grade-grid">
					<div class="avg-grade">
						<ion-card-title> <b>{average} </b></ion-card-title>
						<ion-card-subtitle>M.O.</ion-card-subtitle>
					</div>
					<div>
						<ion-progress-bar class="progress-avg" />
					</div>
				</div>
			</AppCard>
		</div>
		<p class="info-text"><b>Χρήσιμες πληροφορίες</b></p>
		<AppletsSlides />
		<p style="margin-top: 1.5rem" class="info-text"><b>Πρόσφατοι βαθμοί</b></p>
	</ion-content>
</IonPage>

<style>
	.avatar {
		display: block;
		margin: 1.5rem;
	}

	.h5 {
		margin: 0;
		padding-left: 0.5rem;
		color: var(--app-color-primary-dark);
	}

	.student-id {
		margin: 1.5rem;
		border-style: solid;
		border-radius: 17px;
		border-width: 1px;
		border-color: var(--app-color-primary-light);
	}

	.id-icon {
		margin: 1rem;
		font-size: 2.5rem;
		color: var(--app-color-primary-dark);
	}

	.info-container {
		display: grid;
		align-items: center;
		grid-template-columns: 1fr 2fr 1fr;
		column-gap: 1.5rem;
	}

	.card-container {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		align-items: center;
		column-gap: 1rem;
		margin-top: 0.5rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		margin-bottom: 0.5rem;
	}
	.courses-passed {
		align-items: left;
		/* justify-content: center; */
		gap: 0.5rem;
		height: 6rem;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	ion-card-title {
		font-size: 1.5rem;
		color: var(--app-color-primary-dark);
	}
	ion-card-subtitle {
		font-size: 1rem;
		color: var(--app-color-primary-dark);
	}

	.progress-courses {
		--progress-background: white;
		background: var(--app-color-primary-dark);
		height: 1rem;
		margin-top: 0.5rem;
		border-radius: 15px;
	}

	.avg-grade-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		height: 6rem;
	}

	.avg-grade {
		padding-left: 1rem;
	}

	.progress-avg {
		--progress-background: white;
		background: var(--app-color-primary-dark);
		height: 1.5rem;
		margin-left: -0.2rem;
		border-radius: 15px;
		transform: rotate(-90deg);
	}

	.info-text {
		margin-left: 1.5rem;
		margin-top: 2rem;
		margin-bottom: 0;
		font-size: 0.8rem;
	}
</style>
