<script lang="ts">
	import { qrStore } from '$lib/components/wallet/qrStore';
	import { wallet, close } from 'ionicons/icons';
	import gym_id from '$lib/assets/qr/GYM_PLACEHOLDER.svg';
	import student_id from '$lib/assets/qr/ID_PLACEHOLDER.svg';
	import { qr } from '@svelte-put/qr/svg';
	import { t } from '$lib/i18n';
	import { toastController } from 'ionic-svelte';
	import type { ToastOptions } from '@ionic/core';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';
	import 'js-circle-progress'
	import ProgressCircle from '$components/shared/ProgressCircle.svelte';
	import ProgressGauge from '$components/shared/ProgressGauge.svelte';
	import { neoUniversisGet } from '$src/lib/dataService';


	export let reactToHeight: boolean = true;
	export let departmentName: string = '';
	export let studyLevel: string = '';
	export let actualSemester: number = 0;
	export let numPassedSubjects: number = 0;
	export let numSubjects: number = 0;
	export let average: number = 0;

	// Card flip state
	let isFlipped = false;
	let addQRModalOpen = false; // fallback manual-input modal
	let qrDisplayModalOpen = false;
	let qr_input_value: string = '';
	let gymQRPressed = false;
	let schoolQRPressed = false;
	let currentQRData = '';
	let currentQRTitle = '';

	interface Registration {
		id: number;
		semester: number;
		classes: {id: string;finalGrade: number;coefficient: number;isPassed: number;registration: number;course: string}[];
	}

	function openQRDisplay(title: string, data: string) {
		currentQRTitle = title;
		currentQRData = data;
		qrDisplayModalOpen = true;
	}

	function removeCurrentQR() {
		$qrStore = $qrStore.filter((item) => item.title !== currentQRTitle);
		qrDisplayModalOpen = false;
	}

	function saveQR(value: string) {
		if (!value || value.trim() === '') return;
		if (gymQRPressed) {
			$qrStore = $qrStore.concat([{ title: 'gym', data: value }]);
		} else if (schoolQRPressed) {
			$qrStore = $qrStore.concat([{ title: 'school', data: value }]);
		}
	}

	async function scanQRCode() {
		try {
			const result = await CapacitorBarcodeScanner.scanBarcode({
				hint: CapacitorBarcodeScannerTypeHintALLOption.ALL
			});
			if (result?.ScanResult && result.ScanResult.trim() !== '') {
				saveQR(result.ScanResult);
			} else {
				// Scanner returned empty result — open fallback input
				openFallbackModal();
			}
		} catch (_) {
			// Scanner unavailable or user cancelled — open fallback input
			openFallbackModal();
		}
	}

	function openFallbackModal() {
		qr_input_value = '';
		addQRModalOpen = true;
	}

	async function handleManualAdd() {
		if (!qr_input_value || qr_input_value.trim() === '') {
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
			return;
		}
		saveQR(qr_input_value);
		addQRModalOpen = false;
	}

	function toggleCardFlip() {
		isFlipped = !isFlipped;
	}

	async function showToast(toast: ToastOptions) {
		const toast_ = await toastController.create(toast);
		toast_.present();
	}

	async function estimateProgressTrend() {
		const registration_options = "$select=id,semester,classes&$expand=classes($select=id,finalGrade,coefficient,isPassed,course;$filter=isPassed eq 1)&$orderBy=semester&$top=-1"
		const all_registrations: Registration[] = (await neoUniversisGet(`students/me/registrations?${registration_options}`, { lifetime: 1200 })).value

		const calculateGrade_options = "$select=id,course,calculateGrade,isPassed,courseTitle&$filter=calculateGrade eq 0,isPassed eq 1&$top=-1"
		const nonCalculatedGrades: {"id": string;"course": string;"calculateGrade": 0;"isPassed": 1;}[] = (await neoUniversisGet(`students/me/courses?${calculateGrade_options}`, { lifetime: 1200 })).value
		
		const disallowed_courses = new Set(nonCalculatedGrades.map(item => item.course))
		const registrationsInDegree = all_registrations.map(registration => ({
			...registration,
			classes: registration.classes.filter(class_instance => !disallowed_courses.has(class_instance.course) && class_instance.isPassed == 1)
		}))

		// Step 1: compute weighted average per semester
		const semesterAverages = registrationsInDegree.map(registration => {
			const totalWeight = registration.classes.reduce((sum, c) => sum + c.coefficient, 0);
			const weightedSum = registration.classes.reduce((sum, c) => sum + c.finalGrade * c.coefficient, 0);
			return {
				semester: registration.semester,
				average: totalWeight > 0 ? weightedSum / totalWeight : 0
			};
		});

		// Step 2: compare n to n-1
		const progression = semesterAverages.map((current, index) => {
			if (index === 0) return { semester: current.semester, trend: null }; // no previous
			const previous = semesterAverages[index - 1];
			return {
				semester: current.semester,
				average: current.average,
				trend: current.average > previous.average ? "up" : current.average == previous.average ? "stable" : "down" //  up, down, stable
			};
		});
		return progression[progression.length - 2].trend ; // return the trend of the last semester
	}

	let flipClass = false;
	$: flipClass = isFlipped;

	// We need to keep track of the flip container and the front
	// and back children so we can update the height of the flip card.
	let flipContainer: HTMLElement;
	let frontChild: HTMLElement;
	let backChild: HTMLElement;

	// This function updates the height of the flip card when it's toggled.
	const updateHeight = (status: Boolean) => {
		// Important, this code will run once before the flip container is defined, so we need to check it exists.
		if (flipContainer && frontChild && backChild) {
			// The height relative to the rest of the page is dictated by the main container, so we
			// set it's height to the height of the front or back child, depending on the status of the flip.
			// So if we're isFlipped, use the back child, otherwise the front
			flipContainer.style.height = status
				? `${backChild.clientHeight}px`
				: `${frontChild.clientHeight}px`;
		}
	};

	let trend = null;
	let resizeObserver: ResizeObserver;

	onMount(async() => {
		if (reactToHeight) {
			resizeObserver = new ResizeObserver(() => updateHeight(flipClass));
			if (frontChild) resizeObserver.observe(frontChild);
			if (backChild) resizeObserver.observe(backChild);
		}
		trend = await estimateProgressTrend();
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
	});

	// When the flip class changes, update the height of the flip card.
	// Check if we should update the height of the flip card when it's toggled.
	// Sometimes we don't want to do this, that's why it's optional.
	$: if (reactToHeight) updateHeight(flipClass);
	$: passedPct = numSubjects > 0 ? Math.round((numPassedSubjects / numSubjects) * 100) : 0;
</script>

<div class="flip-container" class:flipClass aria-hidden bind:this={flipContainer}>
	<div class="flipper" bind:this={frontChild} aria-hidden>
		<!-- Front of card -->
		<div class="front personal-card card-front ion-activatable" bind:this={frontChild} aria-hidden>
			<ion-ripple-effect/>
			<div class="card-header" aria-hidden>
				<div class="department-info" on:click={toggleCardFlip} aria-hidden>
					<h3 class="department-name">{departmentName}</h3>
					{#if actualSemester !== null}
						<p class="study-level">{studyLevel} - {$t('homepage.semester')} {actualSemester}</p>
					{:else}
						<p class="study-level">{studyLevel}</p>
					{/if}
				</div>

				<div class="wallet-icon-container" on:click={toggleCardFlip} aria-hidden>
					<ion-icon icon={wallet} class="wallet-icon"></ion-icon>
				</div>
			</div>

			<div class="stats-container" on:click={()=>{goto("/pages/grades")}} aria-hidden>
				<ProgressCircle value={passedPct} rightValue="{passedPct}%" rightDesc={$t('homepage.passed')} />
				<ProgressGauge value={(average / 10) * 100} rightValue="{(average).toFixed(2)}" rightDesc={$t('homepage.average')} centerLabel={""} trend={trend} />
			</div>
		</div>

		<!-- Back of card -->
		<div class="back personal-card card-back ion-activatable" bind:this={backChild}>
			<ion-ripple-effect/>
			<div class="card-header wallet-header" aria-hidden>
				<h3 class="department-name" on:click={toggleCardFlip}>{$t('homepage.wallet')}</h3>
				<div class="wallet-icon-container" on:click={toggleCardFlip} aria-hidden>
					<ion-icon icon={wallet} class="wallet-icon"></ion-icon>
				</div>
			</div>

			<div class="wallet-container">
				<div class="wallet-item">
					{#if $qrStore.filter((item) => item.title === "school").length > 0}
						
						<svg 
							use:qr={{
								data: $qrStore.filter((item) => item.title === "school")[0].data,
								shape: 'circle'
							}}
							on:click={()=>openQRDisplay('school', $qrStore.filter((item) => item.title === "school")[0].data)} 
							aria-hidden
						/>
					{:else}
						<img src={student_id} alt="student id" on:click={()=>{ gymQRPressed=false; schoolQRPressed=true; scanQRCode(); }} aria-hidden/>
					{/if}
					<p class="wallet-label">{$t("homepage.schoolQR")}</p>
				</div>
				<div class="wallet-item">
					{#if $qrStore.filter((item) => item.title === "gym").length > 0}
						<svg
							use:qr={{
								data: $qrStore.filter((item) => item.title === "gym")[0].data,
								shape: 'circle'
							}}
							on:click={()=>openQRDisplay('gym', $qrStore.filter((item) => item.title === "gym")[0].data)}
							aria-hidden
						/>
					{:else}
						<img src={gym_id} alt="gym id" on:click={()=>{ gymQRPressed=true; schoolQRPressed=false; scanQRCode(); }} aria-hidden>
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

<!-- Add QR Fallback Modal (shown when the barcode scanner is unavailable or fails) -->
<ion-modal
	is-open={addQRModalOpen}
	on:ionModalDidDismiss={() => { addQRModalOpen = false; }}
	class="add-qr-modal">
	<div class="add-qr-modal-content">
		<h3 class="add-qr-title">{$t('wallet.addQRTitle')}</h3>
		<p class="add-qr-message">{$t('wallet.addQRMessage')}</p>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<ion-input
			type="text"
			mode="ios"
			fill="outline"
			placeholder="{'20' + Math.floor(1000000000 + Math.random() * 9000000000).toString()}"
			value={qr_input_value}
			on:ionInput={(e) => { qr_input_value = e.detail.value ?? ''; }}
		></ion-input>
		<div class="modal-buttons">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ion-button aria-hidden expand="block" mode="ios" color="dark" on:click={() => { addQRModalOpen = false; }} class="cancel-button">
				{$t('wallet.cancel')}
			</ion-button>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ion-button aria-hidden expand="block" mode="ios" color="primary" on:click={handleManualAdd} class="remove-button">
				{$t('wallet.add')}
			</ion-button>
		</div>
	</div>
</ion-modal>

<style>
	:global(body.dark) .card-front{
		background: var(--app-color-primary) !important;
	}

	:global(body.dark) .card-back{
		background: var(--app-color-primary) !important;
	}

	.personal-card {
		background: var(--app-color-map-input);
		border-radius: 1.3rem;
		padding: 1.25rem;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		overflow:hidden;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		color: var(--ion-text-color);
		box-sizing: border-box;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transform: translateZ(0);
		will-change: transform;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
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
		cursor: pointer;
	}

	.department-name {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		color: var(--ion-text-color);
		width: 100%;
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
		position: relative;
		z-index: 1;
	}


	.wallet-header .wallet-icon-container {
		margin-top: -0.8rem;
		margin-bottom: -0.5rem;
	}

	.wallet-icon {
		font-size: 1.8rem;
		color: var(--ion-color-primary);
	}

	.stats-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.1rem;
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
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
		transform: translate3d(0, 0, 0);
	}

	.wallet-item img:hover {
		transform: scale(1.05);
	}

	.wallet-item svg {
		width: 70%;
		max-width: 120px;
		cursor: pointer;
		transition: transform 0.2s ease;
		image-rendering: -webkit-optimize-contrast;
		shape-rendering: crispEdges;
		transform: translate3d(0, 0, 0);
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

	/* Add QR Fallback Modal Styles */
	.add-qr-modal {
		--width: 90%;
		--height: auto;
		--border-radius: 1.5rem;
		--backdrop-opacity: 0.6;
	}

	.add-qr-modal-content {
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--app-color-map-input);
		border-radius: 1.5rem;
	}

	.add-qr-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ion-text-color);
		text-align: center;
	}

	.add-qr-message {
		margin: 0;
		font-size: 0.875rem;
		color: var(--ion-color-medium);
		text-align: center;
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
		background: var(--app-color-map-input);
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

	.flip-container,
	.flipper,
	.front,
	.back {
		will-change: transform;
	}

	/*  */
	.flip-container {
		-webkit-perspective: 700px;
		-moz-perspective: 700px;
		-o-perspective: 700px;
		perspective: 700px;
		transition: height 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
		-webkit-transition: height 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
	}

	/* When flipClass is active, rotate the whole contents of flipper 180 */
	.flip-container.flipClass .flipper {
		-webkit-transform: rotateY(-180deg);
		-moz-transform: rotateY(-180deg);
		-o-transform: rotateY(-180deg);
		-ms-transform: rotateY(-180deg);
		transform: rotateY(-180deg);
	}

	/* Animation for the rotation and style */
	.flipper {
		transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
		-webkit-transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		-moz-transform-style: preserve-3d;
		-o-transform-style: preserve-3d;
		-ms-transform-style: preserve-3d;
		position: relative;
	}

	/* hide back of pane during swap */
	.front,
	.back {
		-webkit-backface-visibility: hidden;
		-moz-backface-visibility: hidden;
		-o-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	/* front pane, placed above back */
	.front {
		z-index: 2;
		/* for firefox 31 */
		position: relative;
		-webkit-transform: rotateY(0deg);
		-moz-transform: rotateY(0deg);
		-o-transform: rotateY(0deg);
		-ms-transform: rotateY(0deg);
		transform: rotateY(0deg);
	}

	/* back, initially hidden pane, moved to the same position as the front pane */
	.back {
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: rotateY(180deg);
		-moz-transform: rotateY(180deg);
		-o-transform: rotateY(180deg);
		transform: rotateY(180deg);
	}


</style>
