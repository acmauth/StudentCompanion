<script lang="ts">
	import AppCard from '$shared/AppCard.svelte';
	import { fastFood, map, link, barbell } from 'ionicons/icons';
	import { navController } from '$components/shared/StackedNav';
	import Menu from '$src/routes/menu/menu.svelte';
	import Maps from '$src/routes/maps/maps.svelte';
	import QuickLinks from '$src/routes/quickLinks/quickLinks.svelte';
	import { Browser } from '@capacitor/browser';
	import { t, locale, locales} from "$lib/i18n";

	// Function to navigate to the applet using stacked navigation
	function navigateToApplet(applet) {
		navController.push(applet);
	}

	async function openCapacitorSite() {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	}
</script>

<!-- <ion-content> -->
	<div class="applets-inline">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="applet-item" on:click={() => navigateToApplet(Menu)}>
			<div class="applet-icon-wrapper orange">
				<ion-icon icon={fastFood} />
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="applet-item" on:click={() => navigateToApplet(Maps)}>
			<div class="applet-icon-wrapper green">
				<ion-icon icon={map} />
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="applet-item" on:click={() => navigateToApplet(QuickLinks)}>
			<div class="applet-icon-wrapper purple">
				<ion-icon icon={link} />
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="applet-item" on:click={() => openCapacitorSite()}>
			<div class="applet-icon-wrapper blue">
				<ion-icon icon={barbell} />
			</div>
		</div>
	</div>
<!-- </ion-content> -->

<style>
	.applets-inline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0;
		margin: 1rem 1.5rem 1.5rem 1.5rem;
		gap: 0.75rem;
	}

	.applet-item {
		flex: 1;
		display: flex;
		justify-content: center;
		cursor: pointer;
	}

	.applet-icon-wrapper {
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.applet-icon-wrapper::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 1px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.applet-icon-wrapper:active {
		transform: scale(0.9);
	}

	.applet-icon-wrapper:hover::before {
		opacity: 1;
	}

	.applet-icon-wrapper ion-icon {
		font-size: 2rem;
		z-index: 1;
	}

	.applet-icon-wrapper.orange {
		background: var(--app-color-orange);
	}

	.applet-icon-wrapper.orange ion-icon {
		color: var(--app-color-orange-dark);
	}

	.applet-icon-wrapper.green {
		background: var(--app-color-green);
	}

	.applet-icon-wrapper.green ion-icon {
		color: var(--app-color-green-dark);
	}

	.applet-icon-wrapper.purple {
		background: var(--app-color-purple);
	}

	.applet-icon-wrapper.purple ion-icon {
		color: var(--app-color-purple-dark);
	}

	.applet-icon-wrapper.blue {
		background: var(--app-color-blue);
	}

	.applet-icon-wrapper.blue ion-icon {
		color: var(--app-color-blue-dark);
	}
</style>
