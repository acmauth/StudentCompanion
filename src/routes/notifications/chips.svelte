<script lang="ts">
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import mail from "$images/mail.png";
    import { toggleAll, toggleElearning, toggleUniversis, toggles, toggleWebmail } from './notificationToggles';
    import { checkmark } from "ionicons/icons"; 
    import { t } from "$lib/i18n";  
</script>

<div class="chipsrow">
    <ion-chip color="primary" outline={!$toggles.all} on:click={() => {toggleAll()}} aria-hidden>
       <ion-label>{$t('notifications.all')}</ion-label>
       {#if $toggles.all}
            <ion-icon icon={checkmark}></ion-icon>
        {/if}
    </ion-chip>
    <ion-chip color="secondary" outline={!$toggles.webmail} on:click={() => {toggleWebmail()}} aria-hidden>
        <ion-avatar>
           <img src={mail} alt="mail icon"/>
        </ion-avatar>
        <ion-label>Webmail</ion-label>
        {#if $toggles.webmail}
             <ion-icon icon={checkmark}></ion-icon>
         {/if}
     </ion-chip>
     <ion-chip color="tertiary" outline={!$toggles.universis} on:click={() => {toggleUniversis()}} aria-hidden>
        <ion-avatar>
           <img src={universisLogo} alt="universis logo"/>
        </ion-avatar>
        <ion-label>Universis</ion-label>
        {#if $toggles.universis}
             <ion-icon icon={checkmark}></ion-icon>
         {/if}
     </ion-chip>
    <ion-chip color="warning" outline={!$toggles.elearning} on:click={() => {toggleElearning()}} aria-hidden>
        <ion-avatar>
           <img src={elearningLogo} alt="elearning logo"/>
        </ion-avatar>
        <ion-label>eLearning</ion-label>
        {#if $toggles.elearning}
            <ion-icon icon={checkmark}></ion-icon>
        {/if}
     </ion-chip>
</div>

<style>
    .chipsrow {
        overflow-x: scroll;
        white-space: nowrap;
        padding-bottom: 1rem;
        padding-left: 0.5rem;
        padding-right: 1rem;
        &::-webkit-scrollbar {
            display: none;
        };
    }

</style>