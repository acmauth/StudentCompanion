<script lang="ts"> 
import { t, locale, locales} from "$lib/i18n";


    const faqs = [
        { id: 1, title: $t('faq.data_safety_q'), answer: $t('faq.data_safety_a') },
        { id: 2, title: $t('faq.use_Aristomate_q'), answer: $t('faq.use_Aristomate_a') },
        { id: 3, title: $t('faq.Aristomate_usefulness_q'), answer: $t('faq.Aristomate_usefulness_a') },
        { id: 4, title: $t('faq.offer_suggestions_q'), answer: $t('faq.offer_suggestions_a') },
        { id: 5, title: $t('faq.register_q'), answer: $t('faq.register_a') },
        { id: 6, title: $t('faq.error_bug_q'), answer: $t('faq.error_bug_a') },
        { id: 7, title: $t('faq.ideas_q'), answer: $t('faq.ideas_a') }
    ];

</script>

<ion-content class="ion-padding">
    <ion-accordion-group expand="inset">
        {#each faqs as faq, i}
            <ion-accordion value={i.toString()}>
            <ion-item slot="header" color="light" style="padding: 0;">
                <ion-text style="display: block; font-size: 15px;">{faq.title}</ion-text>
            </ion-item>
            <div class="ion-padding" slot="content" style="font-size: 15px;">
                <div id="faq-answer-{faq.id}" class="faq-answer">
                    {@html faq.answer}
                </div>
            </div>
            </ion-accordion>
        {/each}
        </ion-accordion-group>       
</ion-content>


