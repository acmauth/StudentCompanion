

<script lang='ts'>

	import AppCard from '$shared/AppCard.svelte';
	import AppletsSlides from './appletsSlides.svelte';
	import { averages } from '$lib/functions/gradeAverages/averages';
	import { neoUniversisGet } from '$lib/dataService';
	import man from '$lib/assets/man.png';
	import { wallet } from 'ionicons/icons';
	import woman from '$lib/assets/woman.png';
	import RecentItems from '$components/recentResults/recents.svelte';
	import HomepageSkeleton from '$lib/components/homepage/homepageSkeleton.svelte';
	import AnnouncementBanner from '$shared/announcementBanner.svelte';

	import { goto } from '$app/navigation';

	import { getVocativeCase } from '$lib/globalFunctions/getVocativeCase';
	import QRGenerator from '$lib/components/wallet/QRGenerator.svelte';
    import { qrStore } from '$lib/components/wallet/qrStore';
    import type { qrItem } from '$lib/components/wallet/qrItem';
	import { onMount } from 'svelte';
	import Banner from '$components/shared/banner.svelte';

	let givenName = '';
	let gender = '';
	let numPassedSubjects = 0;
	let numSubjects = 0;
	let average = 0;
	
	let modalOpen = false;

	async function getInfo() {
		let personalData = await neoUniversisGet('Students/me/');
		givenName = personalData.person.givenName;
		gender = personalData.person.gender;
		let subjects = (await neoUniversisGet('students/me/courses?$top=-1')).value;

		let passedSubjects = subjects.filter(
			(/** @type {{ grade: number; }} */ course: { grade: number }) => course.grade * 10 >= 5
		);

		numSubjects = subjects.length;

		numPassedSubjects = passedSubjects.length;

		averages().then((result) => {
			average = (result as { weighted_avg: number }).weighted_avg;

			let progressBarCourses = document.querySelector('.progress-courses');
			let progressCourses = 0;
			while (progressCourses < numPassedSubjects / numSubjects) {
				if (progressBarCourses) {
					(progressBarCourses as HTMLIonProgressBarElement).value = progressCourses += 0.01;
				}
			}
			let progressBarAvg = document.querySelector('.progress-avg');
			let progressAvg = 0;
			while (progressAvg < average / 10) {
				if (progressBarAvg) {
					(progressBarAvg as HTMLIonProgressBarElement).value = progressAvg += 0.01;
				}
			}
		});
	}

	function addQR() {
		let qrCode = document.querySelector('ion-input');
		if (!qrCode || qrCode.value === '') return;

		const newQR: qrItem = { data: String(qrCode.value), title: 'Πάσο' };
		$qrStore = $qrStore.concat(newQR);
	}

	// Define a reactive variable to control focus behavior of QR Code input element
	let shouldFocus = false;

	$: {
		if (shouldFocus) {
			// Get the input field reference using the ref attribute
			const inputField = document.getElementById('qrcode-input') as HTMLIonInputElement | null;

			// Check if the input field reference exists and then focus on it
			if (inputField) {
				inputField.setFocus();
			}

			// Reset the shouldFocus variable to false to avoid multiple focus attempts
			shouldFocus = false;
		}
	}
</script>

<ion-tab tab="homepage">
	<ion-content class="" fullscreen>
		{#await getInfo()}
			<HomepageSkeleton />
		{:then}
			<!-- <AnnouncementBanner>
				<ion-text
					color="light"
					on:click={() => {
						window.open('https://forms.google.com', '_blank');
					}}
					aria-label="feedback form"
				>
					<ion-label>Early Access Beta - Η γνώμη σου μετράει!</ion-label>
					<ion-icon icon={open} />
				</ion-text>
			</AnnouncementBanner> -->
			<div class="info-container">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="Person-tag" on:click={() => goto('/pages/personalInfo')}>
					{#if gender === 'Α'}
						<img class="avatar ion-padding-vertical" alt="man" src={man} width="200rem" />
					{:else}
						<img class="avatar ion-padding-vertical" alt="man" src={woman} width="200rem" />
					{/if}
					<div>
						<h5 class="h5">Γεια σου</h5>
						<h5 class="h5"><b>{getVocativeCase(givenName)}!</b></h5>
					</div>
				</div>

				<div class="student-id" on:click={() => {modalOpen = true;}}>
					<AppCard margin={false} shadow={true} >
						<div style="background-color: #f3faff">
							<ion-icon class="id-icon" icon={wallet} />
						</div>
					</AppCard>
				</div>

				<ion-modal
					is-open={modalOpen}
					initial-breakpoint={$qrStore.length > 0? 0.5 : 0.2}
					on:ionModalDidDismiss={() => {modalOpen = false;}}
					on:ionModalDidPresent={() => {shouldFocus = true;}}
					breakpoints={[0, 0.1, 0.2, 0.3, 0.5]}>
					<ion-content>
						<ion-grid>
							{#if $qrStore.length == 0}
								<ion-col style="display: flex; justify-content: center; margin: 30px;">
									<ion-input id="qrcode-input" placeholder="Κωδικός QR πάσου" type="number"/>
									<ion-button style="text-transform: none; --box-shadow: var(--shadow-sort-md);" color="secondary"
												on:ionFocus={addQR}>Προσθήκη</ion-button>
								</ion-col>
							
							<!-- Uncomment if adding gym pass/id is implemented -->
						
							<!-- {:else if $qrStore.length == 1}
								<ion-col>
									<QRGenerator qr1={$qrStore[0]}/>
								</ion-col>
								<ion-col style="display: flex; justify-content: center;">
									<ion-button style="text-transform: none; --box-shadow: var(--shadow-sort-md);" color="secondary">QR</ion-button>
								</ion-col> -->
							{:else}
								{#each $qrStore as item}	
									<ion-col>
										<QRGenerator qr1={item}/>
									</ion-col>
								{/each}
							{/if}
						</ion-grid>
					</ion-content>
				</ion-modal>

			</div>
			<div class="card-container">
				<AppCard colour="primary" margin={false} href="/pages/grades">
					<div class="courses-passed">
						<ion-card-title><b> {numPassedSubjects}/{numSubjects} </b></ion-card-title>
						<ion-card-subtitle>Περασμένα</ion-card-subtitle>

						<ion-progress-bar class="progress-courses" />
					</div>
				</AppCard>

				<AppCard colour="primary" margin={false} href="/pages/grades">
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
			<Banner altText="Πες μας τη γνώμη σου" />
			<p style="margin-top: 1.5rem" class="info-text"><b>Πρόσφατα</b></p>
			<RecentItems />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</ion-content>
</ion-tab>

<style>
	.avatar {
		width: 5rem;
	}

	.h5 {
		margin: 0;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		color: var(--app-color-primary-dark);
	}

	.Person-tag {
		display: flex;
		align-items: center;
	}

	.student-id {
		/* margin: 1.5rem; */
		width: fit-content;
		border-style: solid;
		border-radius: 1rem;
		border-width: 1px;
		border-color: var(--app-color-primary-light);
	}

	.id-icon {
		margin: 0.7rem;
		font-size: 2rem;
		color: var(--app-color-primary-dark);
	}

	.info-container {
		display: flex;
		max-height: 5rem;
		margin: 1.5rem;
		justify-content: space-between;
		align-items: center;
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
		justify-content: space-between;
		grid-template-columns: 1fr 1fr;

		align-items: center;
		height: 6rem;
	}

	.avg-grade {
		padding-left: 1rem;
		/* padding-right: -1rem; */
	}

	.progress-avg {
		--progress-background: white;
		background: var(--app-color-primary-dark);
		height: 5vw;
		width: 4rem;
		border-radius: 15px;
		transform: rotate(-90deg);
	}

	.info-text {
		margin-left: 1.5rem;
		margin-top: 2rem;
		margin-bottom: 0;
		font-size: 0.8rem;
	}

	ion-grid {
		display: flex;
		justify-content: center;
		align-items: center; 
	}
</style>
