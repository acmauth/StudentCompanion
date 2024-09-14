<script lang="ts">
	import AppCard from '$shared/AppCard.svelte';
	import { fastFood, map, link, barbell } from 'ionicons/icons';
	import { navController } from '$components/shared/StackedNav';
	import Menu from '$src/routes/menu/menu.svelte';
	import Maps from '$src/routes/maps/maps.svelte';
	import QuickLinks from '$src/routes/quickLinks/quickLinks.svelte';
	import { Browser } from '@capacitor/browser';

	// Function to navigate to the applet using stacked navigation
	function navigateToApplet(applet) {
		navController.push(applet);
	}

	async function openCapacitorSite() {
		await Browser.open({ url: 'https://gym.auth.gr/reservations/' });
	}
</script>

<ion-content style="max-height: 12rem">
	<div style="max-height: 6.5rem" class="applets">
		<AppCard
			colour="orange"
			margin={false}
			shadow={false}
			class="applet"
			onClick={() => navigateToApplet(Menu)}
		>
			<div class="appletcontent">
				<ion-icon icon={fastFood} />
				<ion-label><span class="overflowingtext">Μενού Λέσχης</span></ion-label>
			</div>
		</AppCard>
		<AppCard
			colour="green"
			margin={false}
			shadow={false}
			class="applet"
			onClick={() => navigateToApplet(Maps)}
		>
			<div class="appletcontent">
				<ion-icon icon={map} />
				<ion-label><span class="overflowingtext">Χάρτης ΑΠΘ</span></ion-label>
			</div>
		</AppCard>
	</div>
	<div style="max-height: 6.5rem" class="applets">
		<AppCard
			colour="purple"
			margin={false}
			shadow={false}
			class="applet"
			onClick={() => navigateToApplet(QuickLinks)}
		>
			<div class="appletcontent">
				<ion-icon icon={link} />
				<ion-label><span class="overflowingtext">Σύνδεσμοι</span></ion-label>
			</div>
		</AppCard>
		<AppCard
			colour="blue"
			margin={false}
			shadow={false}
			class="applet"
			onClick={() => openCapacitorSite()}
		>
			<div class="appletcontent">
				<ion-icon icon={barbell} />
				<ion-label><span class="overflowingtext">Γυμναστήριο</span></ion-label>
			</div>
		</AppCard>
	</div>
</ion-content>

<style>
	.overflowingtext {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.applets {
		/* display: inline-flex;
        flex-direction: row;
        align-items: flex-start; */
		/* overflow-x: scroll !important; */
		/*  gap: 1rem; */

		display: grid;
		grid-template-columns: 1fr 1fr;
		/* flex-direction: row;
		align-items: flex-start; */
		justify-content: space-between;
		gap: 1rem;
		margin-left: 1.5rem;
		margin-right: 1.5rem;
		margin-top: 1rem;
	}

	.appletcontent {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: center;
		gap: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		width: 11rem;
	}
	.appletcontent ion-icon {
		font-size: 2rem;
	}
	.appletcontent ion-label {
		font-size: 1rem;
	}
</style>
