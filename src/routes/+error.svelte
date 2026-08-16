<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { homeOutline, mailOutline } from 'ionicons/icons';
    import Logo from '$lib/assets/Logo_full.png';
    import { t } from '$lib/i18n';
    
    $: errorStatus = $page.status;
    $: errorMessage = $page.error?.message || "An unexpected error occurred.";
</script>

<ion-content class="ion-padding">
    <ion-grid class="error-container ion-text-center">
        <img src={Logo} alt="Aristomate logo" class="logo" />
        
        <ion-title class="error-title">😔 {$t('errorPage.title')}</ion-title>
        <ion-text color="medium">
            <p class="error-message">
                {$t('errorPage.message')}<br/>
                {$t('errorPage.subMessage')}
            </p>
        </ion-text>

        <ion-button mode='ios' expand="block" on:click={() => goto('/pages/homepage')} class="home-button" aria-hidden>
            <ion-icon slot="start" icon={homeOutline}></ion-icon>
            {$t('errorPage.homeButton')}
        </ion-button>

        <ion-button mode='ios' expand="block" fill="outline" href="mailto:aristomate@auth.gr?subject={$t('errorPage.reportButton')} - Error {errorStatus}&body=Περιγραφή προβλήματος:%0D%0A%0D%0AError: {errorStatus}%0D%0AMessage: {errorMessage}%0D%0AURL: {$page.url}" class="report-button">
            <ion-icon slot="start" icon={mailOutline}></ion-icon>
            {$t('errorPage.reportButton')}
        </ion-button>

        <ion-text color="medium">
            <p class="error-details">
                Error {errorStatus}: {errorMessage}
                <br/> {$page.url}
            </p>
        </ion-text>
    </ion-grid>
</ion-content>

<style>
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        max-width: 500px;
        margin: 0 auto;
    }

    .logo {
        width: 60%;
        max-width: 250px;
        margin: 20px auto 30px;
        display: block;
    }

    .error-title {
        font-size: 2.5rem;
        margin: 20px 0 10px 0;
        color: var(--app-color-primary-dark);
    }

    .error-message {
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 20px 0;
        padding: 0 20px;
        color: var(--ion-color-medium);
    }

    .home-button {
        margin-top: 30px;
        --background: var(--app-color-primary);
        --background-activated: var(--app-color-primary-dark);
        --background-hover: var(--app-color-primary-light);
        --color: white;
    }

    .report-button {
        margin-top: 10px;
        --border-color: var(--app-color-primary);
        --color: var(--app-color-primary-dark);
    }

    .error-details {
        font-size: 0.75rem;
        margin-top: 20px;
        opacity: 0.6;
        color: var(--ion-color-medium)20px;
        opacity: 0.6;
    }
</style>