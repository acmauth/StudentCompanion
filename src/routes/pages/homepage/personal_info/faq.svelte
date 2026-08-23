<script lang="ts">
    import { t, locale, locales} from "$lib/i18n";
	import SubPageHeader from '$shared/subPageHeader.svelte';
	import IonPage from 'ionic-svelte/components/IonPage.svelte';
	import { helpCircleOutline, mailOutline } from 'ionicons/icons';

    const faqs = [
        { id: 1, title: $t('faq.data_safety_q'), answer: $t('faq.data_safety_a') },
        { id: 2, title: $t('faq.use_Aristomate_q'), answer: $t('faq.use_Aristomate_a') },
        { id: 3, title: $t('faq.Aristomate_usefulness_q'), answer: $t('faq.Aristomate_usefulness_a') },
        { id: 4, title: $t('faq.offer_suggestions_q'), answer: $t('faq.offer_suggestions_a') },
        { id: 5, title: $t('faq.register_q'), answer: $t('faq.register_a') },
        { id: 6, title: $t('faq.error_bug_q'), answer: $t('faq.error_bug_a') },
        { id: 7, title: $t('faq.ideas_q'), answer: $t('faq.ideas_a') }
    ];

    $: supportMailto = `mailto:aristomate@auth.gr?subject=${encodeURIComponent(`Aristomate - ${$t('faq.contact_subject')}`)}`;
</script>


<IonPage>
<SubPageHeader title={$t('faq.title')} stackedNav/>
<ion-content class="ion-padding">
    <div class="faq-intro faq-section">
        <ion-icon icon={helpCircleOutline} color="primary" class="intro-icon" aria-hidden="true"></ion-icon>
        <h1 class="intro-title">{$t('faq.title')}</h1>
        <p class="intro-subtitle">{$t('faq.subtitle')}</p>
    </div>

    <ion-accordion-group class="faq-group faq-section" style="margin-inline: 0;" expand="inset">
        {#each faqs as faq, i (faq.id)}
            <ion-accordion value={i.toString()}>
            <ion-item slot="header" color="light">
                <ion-text class="faq-question">{faq.title}</ion-text>
            </ion-item>
            <div class="ion-padding faq-content" slot="content">
                <div id="faq-answer-{faq.id}" class="faq-answer">
                    {@html faq.answer}
                </div>
            </div>
            </ion-accordion>
        {/each}
    </ion-accordion-group>

    <div class="contact-card faq-section">
        <ion-icon icon={mailOutline} color="primary" class="contact-icon" aria-hidden="true"></ion-icon>
        <h2 class="contact-title">{$t('faq.contact_title')}</h2>
        <p class="contact-text">{$t('faq.contact_text')}</p>
        <ion-button href={supportMailto} fill="solid" shape="round">
            <ion-icon icon={mailOutline} slot="start" aria-hidden="true"></ion-icon>
            {$t('faq.contact_button')}
        </ion-button>
    </div>
</ion-content>
</IonPage>


<style>
    ion-content {
        --padding-end: 1.5rem;
        --padding-start: 1.5rem;
    }

    .faq-section {
        margin-bottom: 1.75rem;
    }

    .faq-intro {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .intro-icon {
        font-size: 42px;
        margin-bottom: 0.5rem;
    }

    .intro-title {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 700;
    }

    .intro-subtitle {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: var(--ion-color-medium);
    }

    .faq-group {
        display: block;
    }

    .faq-question {
        display: block;
        font-size: 15px;
        font-weight: 500;
        white-space: normal;
        padding: 0.35rem 0;
    }

    .faq-content {
        font-size: 15px;
    }

    .faq-answer :global(a) {
        color: var(--ion-color-primary);
    }

    .contact-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: var(--ion-color-light);
        border-radius: 16px;
        padding: 1.75rem 1.25rem;
    }

    .contact-icon {
        font-size: 34px;
        margin-bottom: 0.5rem;
    }

    .contact-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
    }

    .contact-text {
        margin: 0.4rem 0 1.1rem;
        font-size: 0.9rem;
        color: var(--ion-color-medium);
        max-width: 32rem;
    }

</style>
