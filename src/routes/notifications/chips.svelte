<script lang="ts">
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import { toggles } from './notificationToggles';
</script>

<div class="chipsrow">
    <ion-chip color="primary" outline={!$toggles.all} on:click={() => {toggles.toggleAll()}} aria-hidden>
       <ion-label>Όλες οι ειδοποιήσεις</ion-label>
    </ion-chip>
    <ion-chip color="tertiary" outline={!$toggles.universis} on:click={() => {toggles.toggleUniversis()}} aria-hidden>
       <ion-avatar>
          <img src={universisLogo} alt="universis logo"/>
       </ion-avatar>
       <ion-label>Universis</ion-label>
    </ion-chip>
    <ion-chip color="warning" outline={!$toggles.elearning} on:click={() => {toggles.toggleElearning()}} aria-hidden>
        <ion-avatar>
           <img src={elearningLogo} alt="elearning logo"/>
        </ion-avatar>
        <ion-label>eLearning</ion-label>
     </ion-chip>
     <ion-chip color="warning" outline={!$toggles.elSystem} on:click={() => {toggles.toggleelSystem()}} aria-hidden>
        <ion-avatar>
           <img src={elearningLogo} alt="elearning logo"/>
        </ion-avatar>
        <ion-label>System</ion-label>
     </ion-chip>
</div>

<style>
    .chipsrow {
        overflow-x: scroll;
        white-space: nowrap;
        padding-bottom: 1rem;
        &::-webkit-scrollbar {
            display: none;
        }
    }

</style>