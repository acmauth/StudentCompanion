<script>
    import CredentialLogin from "./CredentialLogin.svelte";
    import { keySharp, mail, chevronForwardCircle } from 'ionicons/icons';
	import { userCredsFlag as autheticationFlag} from '$components/credLogin/userCredsFlagStore';

	let loginModalOpen = false;
	$:	if ($autheticationFlag) loginModalOpen = false;

</script>
<ion-item button on:click={()=>{loginModalOpen = true;}} aria-hidden>
    <ion-icon size="small" icon={mail} />
    <ion-label class="ion-padding-start">Σύνδεση webmail</ion-label>
    <ion-icon size="small" icon={chevronForwardCircle} />
</ion-item>

<ion-modal
    is-open={loginModalOpen}
    initial-breakpoint={0.34}
    on:ionModalDidDismiss={() => {loginModalOpen = false;}}
    breakpoints={[0, 0.34	]}
    mode="ios"
    >
    <ion-content>
        <CredentialLogin bind:flag={$autheticationFlag}/>
    </ion-content>
</ion-modal>

<style>
	ion-icon {
		color: var(--app-color-icons);
	}
</style>
