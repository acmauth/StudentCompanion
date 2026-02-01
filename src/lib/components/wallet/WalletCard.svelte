<script lang="ts">
	import { qrStore } from '$lib/components/wallet/qrStore';
	import { wallet, close } from 'ionicons/icons';
	import gym_id from '$lib/assets/qr/GYM_PLACEHOLDER.svg';
	import student_id from '$lib/assets/qr/ID_PLACEHOLDER.svg';
	import { qr } from '@svelte-put/qr/svg';
	import { t } from '$lib/i18n';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';

	export let departmentName: string = '';
	export let studyLevel: string = '';
	export let actualSemester: number = 0;
	export let numPassedSubjects: number = 0;
	export let numSubjects: number = 0;
	export let average: number = 0;

	// Card flip state
	export let isFlipped = false;
	let addQRAlertOpen = false;
	let qrDisplayModalOpen = false;
	let qr_value: string | null = null;
	let gymQRPressed = false;
	let schoolQRPressed = false;
	let currentQRData = '';
	let currentQRTitle = '';

	function openQRDisplay(title: string, data: string) {
		currentQRTitle = title;
		currentQRData = data;
		qrDisplayModalOpen = true;
	}

	function removeCurrentQR() {
		$qrStore = $qrStore.filter((item) => item.title !== currentQRTitle);
		qrDisplayModalOpen = false;
	}

	function toggleCardFlip() {
		isFlipped = !isFlipped;
	}

	async function showToast(toast: ToastOptions) {
		const toast_ = await toastController.create(toast);
		toast_.present();
	}
</script>

<div class="flip-card-container" class:flipped={isFlipped}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="flip-card-inner">
		<!-- Front of card -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="personal-card card-front">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="card-header" on:click={toggleCardFlip}>
				<div class="department-info">
					<h3 class="department-name">{departmentName}</h3>
					<p class="study-level">{studyLevel} - {$t('homepage.semester')} {actualSemester}</p>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="wallet-icon-container" on:click={toggleCardFlip}>
					<ion-icon icon={wallet} class="wallet-icon"></ion-icon>
				</div>
			</div>

			<div class="stats-container">
				<div class="stat-card">
					<div class="stat-header-horizontal">
						<span class="stat-label">{$t('homepage.passed')}</span>
						<span class="stat-value">{Math.round((numPassedSubjects / numSubjects) * 100)}%</span>
					</div>
					<ion-progress-bar class="progress-bar" value="{numPassedSubjects / numSubjects}"></ion-progress-bar>
				</div>
				<div class="stat-card">
					<div class="stat-header-horizontal">
						<span class="stat-label">{$t('homepage.average')}</span>
						<span class="stat-value">{average.toFixed(1)}</span>
					</div>
					<ion-progress-bar class="progress-bar" value="{average / 10}"></ion-progress-bar>
				</div>
			</div>
		</div>

		<!-- Back of card -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="personal-card card-back">
			<div class="card-header" style="margin-bottom: 0;" on:click={toggleCardFlip}>
				<h3 class="department-name">{$t('homepage.wallet')}</h3>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="wallet-icon-container" on:click={toggleCardFlip}>
					<ion-icon icon={wallet} class="wallet-icon"></ion-icon>
				</div>
			</div>

			<div class="wallet-container">
				<div class="wallet-item">
					{#if $qrStore.filter((item) => item.title === "school").length > 0}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<svg 
							use:qr={{
								data: $qrStore.filter((item) => item.title === "school")[0].data,
								shape: 'circle'
							}}
							on:click={()=>openQRDisplay('school', $qrStore.filter((item) => item.title === "school")[0].data)} 
							aria-hidden
						/>
					{:else}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<img src={student_id} alt="student id" on:click={()=>{addQRAlertOpen=true; gymQRPressed=false; schoolQRPressed = true;}} aria-hidden/>
					{/if}
					<p class="wallet-label">{$t("homepage.schoolQR")}</p>
				</div>
				<div class="wallet-item">
					{#if $qrStore.filter((item) => item.title === "gym").length > 0}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<svg
							use:qr={{
								data: $qrStore.filter((item) => item.title === "gym")[0].data,
								shape: 'circle'
							}}
							on:click={()=>openQRDisplay('gym', $qrStore.filter((item) => item.title === "gym")[0].data)}
							aria-hidden
						/>
					{:else}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<img src={gym_id} alt="gym id" on:click={()=>{addQRAlertOpen=true; gymQRPressed=true; schoolQRPressed = false;}} aria-hidden>
					{/if}
					<p class="wallet-label">{$t("homepage.gymQR")}</p>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- QR Display Modal -->
<ion-modal
	is-open={qrDisplayModalOpen}
	on:ionModalDidDismiss={() => {qrDisplayModalOpen = false;}}
	class="qr-display-modal">
	<div class="qr-modal-content">
		<!-- <h3 class="qr-modal-title">{currentQRTitle === 'school' ? $t('homepage.schoolQR') : $t('homepage.gymQR')}</h3> -->
		<div class="qr-display-container">
			<svg
				use:qr={{
					data: currentQRData,
					shape: 'circle'
				}}
				class="qr-large"
				aria-hidden
			/>
		</div>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-buttons">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ion-button expand="block" mode="ios" color="dark" on:click={() => qrDisplayModalOpen = false} class="cancel-button">
				{$t('wallet.cancel')}
			</ion-button>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ion-button expand="block" mode="ios" color="danger" on:click={removeCurrentQR} class="remove-button">
				{$t('wallet.remove')}
			</ion-button>
		</div>
	</div>
</ion-modal>

<!-- Add QR Alert -->
<ion-alert
	is-open={addQRAlertOpen}
	on:ionAlertWillDismiss={() => {qr_value = "";}}
	mode="ios"
	header="{$t('wallet.addQRTitle')}"
	message="{$t('wallet.addQRMessage')}"
	inputs={[
		{
			id: 'qr-input',
			name: 'qr',
			type: 'number',
			placeholder: '20' + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
			value: qr_value
		}
	]}
	buttons={[
		{
			text: $t('wallet.cancel'),
			role: 'cancel',
			handler: () => {
				addQRAlertOpen = false;
			}
		},
		{
			text: $t('wallet.add'),
			handler: async (alertData) => {
				if (!alertData.qr || alertData.qr.trim() === '') {
					await showToast({
						color: 'danger',
						duration: 2500,
						message: $t('wallet.emptyQRError'),
						mode: 'ios',
						translucent: true,
						layout: 'stacked',
						positionAnchor: 'bottom',
						cssClass: 'custom-toast'
					});
					return false;
				}
				if (gymQRPressed) {
					$qrStore = $qrStore.concat([{title:"gym", data: alertData.qr}]);
				} else if (schoolQRPressed) {
					$qrStore = $qrStore.concat([{title:"school", data: alertData.qr}]);
				}
				addQRAlertOpen = false;
			}
		}
	]}
></ion-alert>

<style>
	.flip-card-container {
		/* perspective: 1000px; */
		margin-bottom: -5rem;
		position: relative;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		min-height: 200px;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.flip-card-container.flipped .flip-card-inner {
		transform: rotateY(180deg);
	}

	.personal-card {
		background: var(--app-color-map-input);
		border-radius: 1.3rem;
		padding: 1.25rem;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		color: var(--ion-text-color);
		box-sizing: border-box;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transform: translateZ(0);
		will-change: transform;
	}

	.card-front {
		z-index: 2;
	}

	.card-back {
		transform: rotateY(180deg);
		z-index: 1;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.department-info {
		flex: 1;
	}

	.department-name {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		color: var(--ion-text-color);
	}

	.study-level {
		margin: 0.25rem 0 0 0;
		font-size: 0.8rem;
		color: var(--ion-color-medium);
	}

	.wallet-icon-container {
		border-radius: 0.75rem;
		padding: 0.5rem;
		margin-top: -0.5rem;
		padding-inline-end: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.wallet-icon {
		font-size: 1.8rem;
		color: var(--ion-color-primary);
	}

	.stats-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding-bottom: 0.5rem;
	}

	.stat-card {
		border-radius: 0.875rem;
		padding: 0rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-header-horizontal {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stat-label {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--ion-color-medium);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ion-text-color);
	}

	.progress-bar {
		--progress-background: var(--ion-color-primary);
		background: var(--ion-color-light-shade);
		height: 0.7rem;
		border-radius: 10px;
	}

	.wallet-container {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1rem;
	}

	.wallet-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.wallet-item img {
		width: 70%;
		max-width: 120px;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.wallet-item img:hover {
		transform: scale(1.05);
	}

	.wallet-item svg {
		width: 70%;
		max-width: 120px;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.wallet-item svg:hover {
		transform: scale(1.05);
	}

	.wallet-label {
		text-align: center;
		font-size: 0.875rem;
		color: var(--ion-text-color);
		margin: 0;
	}

	/* QR Display Modal Styles */
	.qr-display-modal {
		--width: 90%;
		--height: auto;
		--border-radius: 1.5rem;
		--backdrop-opacity: 0.6;
        --background: transparent
	}

	.qr-modal-content {
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		position: relative;
		--background: transparent;
	}

    .qr-display-container {
		width: 100%;
		max-width: 320px;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.qr-large {
		width: 100%;
		height: 100%;
	}

	.modal-buttons {
		width: 100%;
		display: flex;
		gap: 0.75rem;
	}

	.cancel-button,
	.remove-button {
		flex: 1;
		margin: 0;
	}
</style>
