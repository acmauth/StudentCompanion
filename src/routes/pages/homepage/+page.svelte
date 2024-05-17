

<script lang='ts'>

	import AppCard from '$shared/AppCard.svelte';
	import AppletsSlides from './appletsSlides.svelte';
	import { wallet, cogOutline } from 'ionicons/icons';
	import logo  from '$lib/assets/Logo_head.png';

	import { goto } from '$app/navigation';

	import QRGenerator from '$lib/components/wallet/QRGenerator.svelte';
    import { qrStore } from '$lib/components/wallet/qrStore';
    import type { qrItem } from '$lib/components/wallet/qrItem';
	
	let modalOpen = false;

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

			<div class="info-container">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="Person-tag" on:click={() => goto('/pages/personalInfo')}>
					<img class="avatar ion-padding-vertical" alt="logo" src={logo} width="200rem" />
					<div>
						<h5 class="h5">Γεια χαρά!</h5>
					</div>
				</div>

				<div class="student-id" on:click={() => {modalOpen = true;}} aria-hidden>
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
			
			<div style="display: flex;
			justify-content: center;
			align-items: center;
			height: 15%;
			padding: 80px;"> 
				<ion-icon style="--ionicon-stroke-width: 3rem; font-size: 8rem" color="primary" icon={cogOutline}/>
			</div>

			<AppCard margin={true} shadow={true} padding>
				<div style="padding: 10px; text-align:center;" >
				Η εφαρμογή είναι προσωρινά μη διαθέσιμη, καθώς υλοποιείται η ενσωμάτωσή της στα συστήματα του ΚΗΔ ΑΠΘ.
				<br />
				Θα ενημερωθεί τις επόμενες ημέρες με ακόμη περισσότερες δυνατότητες!
			</AppCard>	

			<AppletsSlides />

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

	ion-grid {
		display: flex;
		justify-content: center;
		align-items: center; 
	}
</style>
