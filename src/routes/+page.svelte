<script>
	import { goto } from '$app/navigation';
	import { judgeAuth } from '$lib/authentication/authValidator';
	import { onMount } from 'svelte';
	
	// Handling the redirect to the homepage
	onMount(async () => {
		if (await judgeAuth()) {
			goto('pages/homepage');
		} else {
			goto('login');}
		}
	);
</script>
<ion-page style="overflow-y: auto;">
	<ion-card>
		<ion-card-header>
			<ion-card-subtitle>Student companion (test) homepage</ion-card-subtitle>
		</ion-card-header>
		<ion-button href="/homepage">Homepage</ion-button>
		<ion-card-content>
			Let's list here our quick page links, before we get navigation figured out
		</ion-card-content>
		<ion-button href="/login">Log in</ion-button>
	</ion-card>

	<ion-card>
		<ion-card-header>
			<ion-card-subtitle>Grades Page</ion-card-subtitle>
		</ion-card-header>
		<ion-button href="/grades">Grades</ion-button>
	</ion-card>

<ion-card>
	<ion-card-header>
		<ion-card-subtitle>Personal Info Page</ion-card-subtitle>
	</ion-card-header>
	<ion-button href="/personalInfo">Personal Info</ion-button>
</ion-card>

<ion-card>
	<ion-button href="/schedule/classes">Schedule</ion-button>
	<ion-button href="/notifications">Notifications</ion-button>
</ion-card>

<ion-card>
	<ion-card-header>
		<ion-card-subtitle>Calculate degree Grade</ion-card-subtitle>
	</ion-card-header>
	<ion-button href="/degreeCalculator">Calculate Degree Grade</ion-button>
</ion-card>


	<ion-card>
		<ion-card-header>
			<ion-card-subtitle>Restaurant Menu</ion-card-subtitle>
		</ion-card-header>
		<ion-button href="/menu">Weekly Menu</ion-button>
	</ion-card>

	<ion-card>
		<ion-button href="/quickLinks">Quick Links</ion-button>
	</ion-card>
</ion-page>
