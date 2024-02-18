<script lang="ts">    
    let faqs = [
        { id: 1, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 2, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 3, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 4, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 5, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 6, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 7, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 8, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 9, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 10, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 11, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 12, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 13, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 14, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 15, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 16, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 17, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 18, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 19, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 20, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 21, title: "Do you steal our personal data?", answer: "Yes we do" },
        { id: 22, title: "Do you steal our personal data?", answer: "Yes we do" },
        
    ];
</script>

<!-- FAQ.svelte -->
<ion-content class="ion-padding">
    <div class="about-card">
        <div class="card-content">
    <h1 class="about-us-title">
        <span class="faq-text">FAQs</span>
    </h1>
    </div>
    <ion-accordion-group>
        {#each faqs as faq}
            <ion-accordion value={faq.id.toString()}>
            <ion-item slot="header" color="light" style="white-space: normal;">
                <ion-label style="overflow-wrap: break-word;">{faq.title}</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">{faq.answer}</div>
            </ion-accordion>
        {/each}
        </ion-accordion-group>       
    </div>
</ion-content>

  
<style>
    .about-card {
        margin-bottom: 30px;
        border-radius: 15px;
        box-shadow: var(--ion-shadow-md);
    }

    .about-us-title {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5rem; /* Larger font size */
    }

    .card-content {
        padding: 20px;
    }

    .faq-text {
        background: linear-gradient(to right, var(--ion-color-primary), var(--ion-color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>

  