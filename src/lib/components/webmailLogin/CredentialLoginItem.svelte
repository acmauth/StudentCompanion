<script>
    import CredentialLogin from "./CredentialLogin.svelte";
    import { mail, chevronForwardCircle } from 'ionicons/icons';
	import { userCredsFlag as autheticationFlag} from '$components/webmailLogin/userCredsFlagStore';
    import { t } from "$lib/i18n";


	let loginModalOpen = false;
	$:	if ($autheticationFlag) loginModalOpen = false;

</script>

{#if $autheticationFlag == false}
    <ion-item button on:click={()=>{loginModalOpen = true;}} aria-hidden>
        <ion-icon size="small" icon={mail} />
        <ion-label class="ion-padding-start">{$t("settings.webmail")}</ion-label>
        <ion-icon size="small" icon={chevronForwardCircle} />
    </ion-item>
{/if}

<CredentialLogin bind:loginModalOpen={loginModalOpen} />

<style>
	ion-icon {
		color: var(--app-color-icons);
	}
</style>
