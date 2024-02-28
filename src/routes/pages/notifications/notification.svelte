<script lang="ts">
	import type { notification } from "./notifications";
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import { openOutline, open } from 'ionicons/icons';
    import AppCard from "$shared/AppCard.svelte";

    export let notification: notification;

    let inlineModalOpen = false;
    let breakpoints = [0, 0.5, 1];
    
    const inlineModalDismissed = (val: any) => {inlineModalOpen = false;};

    function timeSinceDate(date:Date){
        var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      
    }
</script>

<AppCard onClick={() => {inlineModalOpen = true}} class="ion-padding">
    <div class="top">
            <img alt="Service logo" src={notification.type == "universis" ? universisLogo : elearningLogo} />
            
            <ion-label><p>{notification.sender} - {timeSinceDate(notification.dateReceived)}</p></ion-label>
    </div>
    <ion-item lines="none" class="ion-no-padding">
        <ion-label>
            <h2>{notification.subject}</h2>
            <p>{notification.body}</p>
        </ion-label>
    </ion-item>
</AppCard>

<ion-modal
      is-open={inlineModalOpen}
      initial-breakpoint={0.5}
      {breakpoints}
      on:ionModalDidDismiss={inlineModalDismissed}>
      <ion-content>
            <div class="mainContainer">
                <ion-item-group>
                    <ion-item lines="none">
                        <ion-text>
                            <h2>{notification.subject}</h2>
                        </ion-text>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-chip outline color={notification.type == "universis" ? "tertiary" : "warning"}>
                            <ion-avatar>
                                <img alt="Service logo" src={notification.type == "universis" ? universisLogo : elearningLogo} />
                            </ion-avatar>
                            <ion-label>{notification.sender}</ion-label>
                        </ion-chip>
                        {#if notification.url}
                        <ion-item lines="none" href={notification.url} target="blank">
                            <ion-chip color="primary">
                                <ion-icon icon={open} ></ion-icon>
                                <ion-label>Άνοιγμα</ion-label>
                            </ion-chip>
                        </ion-item>
                        {/if}
                    </ion-item>
                    <ion-item-divider>
                        <ion-label>Περιεχόμενο </ion-label>
                      </ion-item-divider>                    
                    <ion-item lines="none">
                        <ion-text>
                            <p>
                                {@html notification.body.replaceAll('\n', '&nbsp;')}
                            </p>
                                
                        </ion-text>
                    </ion-item>
                    <ion-item>
                        <ion-text>
                            <p class="date">
                                Ημερομηνία: {notification.dateReceived.toLocaleString()}
                            </p>
                        </ion-text>
                    </ion-item>
                </ion-item-group>
            </div>
        </ion-content>
    </ion-modal>

    <style>

        .mainContainer {
            padding: 0.5rem;
        }

        .date {
            font-size: smaller !important;
        }

        ion-chip {
            margin: 0rem !important;
        }

        .top {
            display: flex;
            align-items: center;
            vertical-align: middle;
            gap: 0.5rem;
            height: 1rem;
        }

        .top img {
            object-fit: contain;
            height: 100%;
        }
</style>