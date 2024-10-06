<script>
    import CredentialLogin from "./CredentialLogin.svelte";
    import { keySharp } from 'ionicons/icons';
	import { userCredsFlag as autheticationFlag} from '$components/webmailLogin/userCredsFlagStore';
    import { t } from "$lib/i18n";

	let loginModalOpen = false;
</script>

{#if $autheticationFlag == false}
    <ion-chip mode="ios" color="dark" on:click={()=>{loginModalOpen = true;}} aria-hidden>
        <ion-icon icon={keySharp} color="dark"></ion-icon>
        <ion-label>{$t("settings.webmail")}</ion-label>
    </ion-chip>
{/if}

<ion-modal
    is-open={loginModalOpen }
    initial-breakpoint={0.5}
    on:ionModalDidDismiss={() => {loginModalOpen = false;}}
    breakpoints={[0, 0.5]}
    mode="ios"
    >
    <ion-content>
        <CredentialLogin bind:openModalFlag={loginModalOpen} />
    </ion-content>
</ion-modal>