<script lang="ts">
	import { goto } from '$app/navigation';
	import Vector from '$lib/components/loginService/Vector.svg';
	import Vector1 from '$lib/components/loginService/Vector(1).svg';
	import Logo from '$lib/assets/Logo_head.png';
	import Keycloakthings from '$src/routes/login/core';
	import { helpCircle } from 'ionicons/icons';
	import { page } from '$app/stores';
	import { App } from '@capacitor/app';
	import { onMount } from 'svelte';

	const isProduction = process.env.NODE_ENV === 'production';

	console.log('LOGIN PAGE');
	$: console.log($page.url.href);

	let invalidData = false;
	let isVisible = false;

	let token_expiry = $page.url.searchParams.get('token_expiry');

	let inlineModalOpen = false;

	onMount(async () => {
		await App.addListener('appUrlOpen', function (event) {
			// slug = /tabs/tabs2
			const slug = event.url.split('#')[1];
			console.log(event.url);
			console.log(slug);

			goto(`authenticate#${slug}`);

			// We only push to the route if there is a slug present
			// if (slug) {
			// 	goto(slug);
			// }
		});

		console.log('LOGIN PAGE');
	});
</script>

<ion-content fullscreen>
	<div style="position: relative; width: 100%; height: 40%; ">
		<img src={Vector} alt="Vector" style="position: absolute; width: 110%; height:70%" />
		<img src={Vector1} alt="Overlay Icon" style="width: 110%; height:85%" />
	</div>

	<div
		style="display: flex; flex-direction: column; align-items: center; margin-top: -40px; justify-content: top; padding-right:20px; padding-left:20px;"
	>
		<img src={Logo} alt="Aristomate logo" style="width: 30%; margin-bottom: 25px;" />
		<!-- <ion-text style="color: var(--ion-color-primary)">
			Καλώς ήρθες στο Aristomate!
		</ion-text> -->
		<div
			class="academiclogin"
			style="display:flex; flex-direction:row; align-items: center; justify-content: center; gap: 4px;"
		>
			<ion-text>Καλώς ήρθες στο Aristomate!</ion-text>
		</div>

		{#if token_expiry}
			<div
				style="display: flex; flex-direction:row; align-items:center"
				on:click={() => {
					inlineModalOpen = true;
				}}
				aria-hidden
			>
				<ion-label style="color: var(--ion-color-primary)">Γιατί με πετάει</ion-label>
				<ion-icon
					src={helpCircle}
					style="width: 2rem; height: 2rem; color: var(--ion-color-primary)"
					alt="Why am I getting kicked"
				/>
			</div>

			<ion-modal
				is-open={inlineModalOpen}
				initial-breakpoint={0.4}
				breakpoints={[0.4, 0.8]}
				handle-behavior="cycle"
			>
				<ion-content>
					<div style="overflow-x: hidden;">
						<ion-item-group>
							<ion-item class="modal-item">
								<ion-text class="centered-text">
									<h3>Γιατί με πετάει κάθε μέρα;</h3>
								</ion-text>
							</ion-item>

							<ion-item lines="none" class="modal-item">
								<div class="ion-padding">
									Λίγη ακόμη υπομονή! Η εφαρμογή θέτει σε πρώτη προτεραιότητα την διασφάλιση του
									απορρήτου των δεδομένων σου. Εργαζόμαστε πάνω σε αυτό.
								</div>
							</ion-item>
						</ion-item-group>
					</div>
				</ion-content>
			</ion-modal>
		{/if}

		{#if invalidData}
			<ion-label class="error">Λανθασμένα στοιχεία σύνδεσης</ion-label>
		{/if}
		{#if isVisible}
			<div class="loading-panel">
				<ion-spinner class="loginSpinner" />
				<p class="loginP">Περιμένετε...</p>
			</div>
		{/if}

		<ion-button
			aria-hidden
			class="custom"
			on:click={() => Keycloakthings.login({ scope: 'students:read' })}
			style="margin-top:2rem;">Σύνδεση ΑΠΘ</ion-button
		>
		<div class="footer">
			<ion-title size="small" color="primary" style="padding-bottom: 15px; font-size: small;"
				>Powered by <br /><strong>Aristotle University of Thessaloniki</strong>.</ion-title
			>
		</div>
	</div>
</ion-content>

<style>
	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding-top: 35px;
		position: absolute;
		bottom: 0;
	}

	.academiclogin {
		color: #98bdd6;
		margin-bottom: 10px;
		/* font-weight: bold; */
	}

	ion-button.custom {
		--background: var(--ion-color-primary);
		--color: var(--ion-color-light);
		--border-radius: 1rem;
		--box-shadow: var(--shadow-sort-md);
		width: 60%;
		height: 3rem;
	}

	.loading-panel {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	ion-spinner.loginSpinner {
		--color: white;
		margin-right: 10px;
	}

	p.loginP {
		color: white;
		margin: 0;
	}

	.centered-text {
		text-align: center;
		margin: 1rem;
		width: 100%;
	}

	.modal-item {
		--padding-start: 16px;
		--padding-end: 16px;
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>
