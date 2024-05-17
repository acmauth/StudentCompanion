<script lang="ts">
	import * as allIonicIcons from 'ionicons/icons';
</script>


<ion-content>
	<ion-item button href="/about">
		<ion-icon size="small" icon={allIonicIcons.people} />
		<ion-label class="ion-padding-start">Σχετικά με εμάς</ion-label>
		<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
		
	</ion-item>

	<ion-item button href="/faq">
		<ion-icon size="small" icon={allIonicIcons.helpCircle} />
		<ion-label class="ion-padding-start">FAQ</ion-label>
		<ion-icon size="small" icon={allIonicIcons.chevronForwardCircle} />
	</ion-item>

</ion-content>


<style>
	ion-icon {
		color: var(--app-color-primary-dark);
	}
</style>
