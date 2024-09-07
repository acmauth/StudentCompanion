<script>
    import CredentialLogin from "./CredentialLogin.svelte";
    import { keySharp } from 'ionicons/icons';
	import { userCredsFlag as autheticationFlag} from '$components/webmailLogin/userCredsFlagStore';

	let loginModalOpen = false;
	$:	if ($autheticationFlag) loginModalOpen = false;

</script>

{#if $autheticationFlag == false}
    <ion-chip mode="ios" color="dark" on:click={()=>{loginModalOpen = true;}} aria-hidden>
        <ion-icon icon={keySharp} color="dark"></ion-icon>
        <ion-label>Σύνδεση webmail</ion-label>
    </ion-chip>
{/if}
<ion-modal
    is-open={loginModalOpen && !$autheticationFlag}
    initial-breakpoint={0.34}
    on:ionModalDidDismiss={() => {loginModalOpen = false;}}
    breakpoints={[0, 0.34	]}
    mode="ios"
    >
    <ion-content>
        <CredentialLogin bind:flag={$autheticationFlag}/>
    </ion-content>
</ion-modal>