<script lang="ts">
    import { keySharp } from 'ionicons/icons';
	import { userCredsFlag as autheticationFlag} from '$components/webmailLogin/userCredsFlagStore';
    import { t } from "$lib/i18n";
    import { Keyboard } from "@capacitor/keyboard";
	import { showLoginAlert } from "./credentialLogin";

	let loginModalOpen = false;
    let modalCard: any;

    Keyboard.addListener('keyboardWillShow', ev => {
        modalCard.setCurrentBreakpoint(0.9);
    });

    Keyboard.addListener('keyboardWillHide', () => {
        modalCard.setCurrentBreakpoint(0.5)
    });
</script>

{#if $autheticationFlag == false}
    <ion-chip mode="ios" color="dark" on:click={showLoginAlert} aria-hidden>
        <ion-icon icon={keySharp} color="dark"></ion-icon>
        <ion-label>{$t("settings.webmail")}</ion-label>
    </ion-chip>
{/if}
