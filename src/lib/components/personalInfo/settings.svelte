<script>
	import * as allIonicIcons from 'ionicons/icons';
	
	/**
	 * @type {any}
	 */
	 export let logOut;
</script>

<ion-card>
	<ion-card-content>

		<ion-item button href="/routes/about/+page.svelte">
			<ion-icon size="small" icon={allIonicIcons.people} />
			<ion-label class="ion-padding-start">Σχετικά με εμάς</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
			
		</ion-item>

		<!-- <ion-item button>
			<ion-icon size="small" icon={allIonicIcons.brush} />
			<ion-label class="ion-padding-start">Change Theme</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item> -->

		<ion-item button>
			<ion-icon size="small" icon={allIonicIcons.helpCircle} />
			<ion-label class="ion-padding-start">FAQ</ion-label>
			<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		</ion-item>
	
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<ion-item button lines="none" on:click={logOut}>
			<ion-icon color="danger" size="small" icon={allIonicIcons.exit} />

			<ion-label color="danger" class="ion-padding-start">Αποσύνδεση</ion-label>
			<ion-icon color="danger" size="small" icon={allIonicIcons.chevronForwardCircle} />
			
		</ion-item>

		</ion-card-content>

	</ion-card>



	<style>

		ion-icon {
		color: var(--ion-color-primary);
		}

	</style>
