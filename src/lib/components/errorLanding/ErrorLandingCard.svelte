<script lang='ts'>
    import { sadOutline } from 'ionicons/icons';
    export let errorMsg: string;
</script>

<ion-card class="custom-card">
    <ion-icon icon={sadOutline} class="custom-icon"></ion-icon>
    <ion-title class="custom-title">Ωχ!</ion-title>
    <ion-subtitle>Φαίνεται πως προέκυψε κάποιο σφάλμα.</ion-subtitle>
    <ion-list inset={true}>
        <ion-accordion-group>
           <ion-accordion class="custom-accordion">
              <ion-item slot="header">
                 <ion-label color="medium">Περισσότερες λεπτομέρειες</ion-label>
              </ion-item>
              <ion-list slot="content">
                 <ion-item class="custom-accordion-item" text-wrap>
                    <ion-label color="medium">{errorMsg}</ion-label>
                 </ion-item>
              </ion-list>
           </ion-accordion>
     </ion-accordion-group>    
    </ion-list>
</ion-card>

<style>
    .custom-card {
        text-align: center;
        padding: 10px;
        padding-bottom: 0;
    }

    .custom-icon {
        font-size: 4rem;
        padding: 10px;
        margin: 10px;

    }

    .custom-title {
        font-size: 2rem;
        margin-bottom: 15px;
    }

    .custom-accordion {
        transform: scale(0.8); 
    }
</style>