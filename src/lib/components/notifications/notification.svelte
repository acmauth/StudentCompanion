<script lang="ts">
	import type { notification } from "./notifications";
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import mail from "$images/mail.png";
    import { open } from 'ionicons/icons';
    import timeSinceDate from "$lib/globalFunctions/getTimeSinceDate";
    import DOMPurify, { sanitize } from 'dompurify';
	import { onMount } from "svelte";

    export let notification: notification;
    let iframe: HTMLIFrameElement;
    let inlineModalOpen = false;
    let breakpoints = [0, 0.5, 1];
    
    const inlineModalDismissed = (val: any) => {inlineModalOpen = false;};

    let content = DOMPurify.sanitize(notification.body, {SANITIZE_NAMED_PROPS: true}).trim().replace(/\s+/g, ' ').replace(/\s+/g, ' ');

    // Adding an event listener to the iframe to set the height of the iframe to the content of the iframe
    onMount(() => {
        iframe.addEventListener('load', onMailLoad);
    });


    // Fixing the height of the iframe
    function fixIframeHeight() {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 100 + 'px';
    }


    // Fixing the content of the iframe
    function fixIframeContent(){    
        // Getting the body of the iframe
        const body = iframe.contentDocument.querySelector("html");
        
        if (body) {

            const root = document.documentElement;
            const bodyColor = getComputedStyle(root).getPropertyValue('--app-color-notification');
            // Style reset for the iframe
            body.style.fontFamily = "Roboto, sans-serif";
            body.style.overflowY = "hidden";
            body.style.color = bodyColor.trim();

            // Adding a base tag to the iframe to open links in a new tab instead of inside the iframe
            const baseTag = document.createElement('base');
            baseTag.target = '_blank';
            body.appendChild(baseTag);
        }
    }


    // Applying some fixes to the iframe content on the fly
    function onMailLoad(){
        fixIframeHeight()
        
        fixIframeContent();

        // Janky fix for a race condition where the iframe height is not set correctly
        setTimeout(() => {
            fixIframeHeight();
        }, 1000);

    }
</script>


<div aria-hidden on:click ={() => {inlineModalOpen = true}} class="card-link">
    <div class="top">
            <img alt="Service logo" src={notification.type == "universis" ? universisLogo : notification.type == "webmail" ? mail : elearningLogo} />
            <ion-label class="notification-label sender">
                <p>{notification.sender}</p>
              </ion-label>
              <p>-</p>
              <ion-label class="notification-label date">
                <p>{timeSinceDate(notification.dateReceived)}</p>
              </ion-label>
              
            
  
            <!-- <ion-label><p>{notification.sender} - {timeSinceDate(notification.dateReceived)}</p></ion-label> -->
    </div>
    <ion-item lines="none" class="ion-no-padding">
        <ion-label>
            <h2 class="ellipse-no-wrap">{notification.subject}</h2>
        </ion-label>
    </ion-item>
</div>


<ion-modal
      is-open={inlineModalOpen}
      initial-breakpoint={0.5}
      {breakpoints}
      handle-behavior="cycle"
      on:ionModalDidDismiss={inlineModalDismissed}>
      <ion-content >
            <div class="mainContainer">
                <ion-item-group>
                    <ion-item lines="none">
                        <ion-text>
                            <h2>{notification.subject}</h2>
                        </ion-text>
                    </ion-item>
                    <ion-item lines="none">
                        <ion-chip outline color={notification.type == "universis" ? "tertiary" : notification.type == "webmail" ? "secondary" : "warning"}>
                            <ion-avatar>
                                <img alt="Service logo" src={notification.type == "universis" ? universisLogo : notification.type == "webmail"? mail : elearningLogo} />
                            </ion-avatar>
                            <ion-label style="overflow:hidden; white-space: nowrap;">
                                {#if notification.email}
                                    <a href="mailto:{notification.email}" style="text-decoration: none; color: inherit;">
                                        {notification.sender}
                                    </a>
                                {:else}
                                    {notification.sender}
                                {/if}
                            </ion-label>
                        </ion-chip>
                        {#if notification.url}
                        <ion-item lines="none"> 
                            <ion-chip color="primary" on:click={()=>{window.location = notification.url}} aria-hidden>
                                <ion-icon icon={open} ></ion-icon>
                                <ion-label>Άνοιγμα</ion-label>
                            </ion-chip>
                        </ion-item>
                        {/if}
                    </ion-item>
                    <ion-item-divider>
                        <ion-label>Περιεχόμενο </ion-label>
                      </ion-item-divider>                    
                    <ion-item lines="none" class="item-text-wrap ion-no-padding">
                        <iframe bind:this={iframe}
                        title="Body"
                        srcdoc={content}
                        src="about:blank"
                        style="width: 100%; border: none;"/>
                    </ion-item>
                    <ion-item-divider >
                        <ion-label>Ημερομηνία: {notification.dateReceived.toLocaleString()}</ion-label>
                      </ion-item-divider> 
                </ion-item-group>
            </div>
        </ion-content>
    </ion-modal>

    <style>
        .ellipse-no-wrap {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

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

        .top p {
            margin: 0;
        }

        .card-link {
            text-decoration: none;
        }

        .notification-label {
            white-space: nowrap;
            display: block; 
        }

        .sender {
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            max-width: calc(100% - 80px); /* Adjust as needed */
        }

        .date p {
            white-space: nowrap;
        }

</style>