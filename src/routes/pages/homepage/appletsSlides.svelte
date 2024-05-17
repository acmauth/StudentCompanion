<script lang="ts">
	import AppCard from '$shared/AppCard.svelte';
	import { fastFood, map, link, calendarClear } from 'ionicons/icons';
</script>


	<div class="applets">
		<AppCard
			colour="orange"
			margin={false}
			shadow={false}
			class="applet"
			maxWidth="9rem"
			href="/menu"
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
			maxWidth="9rem"
			href="/maps"
		>
			<div class="appletcontent">
				<ion-icon icon={map} />
				<ion-label><span class="overflowingtext">Χάρτης ΑΠΘ</span></ion-label>
			</div>
		</AppCard>
		<AppCard
			colour="purple"
			margin={false}
			shadow={false}
			class="applet"
			maxWidth="9rem"
			href="/quickLinks"
		>
			<div class="appletcontent">
				<ion-icon icon={link} />
				<ion-label><span class="overflowingtext">Σύνδεσμοι</span></ion-label>
			</div>
		</AppCard>
		<AppCard
			colour="primary"
			margin={false}
			shadow={false}
			class="applet"
			maxWidth="9rem"
			href="/pages/schedule"
		>
			<div class="appletcontent">
				<ion-icon icon={calendarClear} />
				<ion-label><span class="overflowingtext">Πρόγραμμα</span></ion-label>
			</div>
		</AppCard>
	</div>

<style>
	.overflowingtext {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.applets {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    flex-wrap: wrap; /* Add this line */
	justify-content: center;
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
    width: 9rem;
}
.appletcontent ion-icon {
    font-size: 2rem;
}
.appletcontent ion-label {
    font-size: 1rem;
}
</style>
