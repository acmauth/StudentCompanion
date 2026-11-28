<script>
    import { mail, chevronForwardCircle } from 'ionicons/icons';
	import { webmailLoggedIn as autheticationFlag} from '$services/webmail/userCredsFlagStore';
    import { t } from "$methods/i18n";
	import { showLoginAlert } from '$services/webmail/credentialLogin';
	import Config from "$src/app.config";

	let loginModalOpen = false;
	$:	if ($autheticationFlag) loginModalOpen = false;

</script>

{#if $autheticationFlag == false && (Config.isAndroid || Config.isDevelopment)}
    <ion-item button on:click={showLoginAlert} aria-hidden>
        <ion-icon size="small" icon={mail} />
        <ion-label class="ion-padding-start">{$t("settings.webmail")}</ion-label>
        <ion-icon size="small" icon={chevronForwardCircle} />
    </ion-item>
{/if}


<style>
	ion-icon {
		color: var(--app-color-icons);
	}
</style>
