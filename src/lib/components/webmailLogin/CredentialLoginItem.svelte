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

<ion-modal
    is-open={loginModalOpen}
    initial-breakpoint={0.5}
    on:ionModalDidDismiss={() => {loginModalOpen = false;}}
    breakpoints={[0, 0.5]}
    mode="ios"
    >
    <ion-content>
        <CredentialLogin bind:openModalFlag={loginModalOpen} />
    </ion-content>
</ion-modal>

<style>
	ion-icon {
		color: var(--app-color-icons);
	}
</style>
