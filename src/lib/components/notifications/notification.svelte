<script lang="ts">
	import type { notification } from "./notifications";
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import mail from "$images/mail.png";
    import { open } from 'ionicons/icons';
    import timeSinceDate from "$lib/globalFunctions/getTimeSinceDate";
    import DOMPurify, { sanitize } from 'dompurify';
	import { onMount } from "svelte";
    import { t, getLocale } from "$lib/i18n";

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
        if (iframe){
            iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 100 + 'px';
        }
    }


    // Fixing the content of the iframe
    function fixIframeContent(){    
        // Getting the body of the iframe
        const body = iframe.contentDocument.querySelector("html");
        let bodyColor = '';
        if (body) {
            const root = document.documentElement;
            // Check if body has the class 'dark'
            if (document.body.classList.contains('dark')) {
                
            // Get the CSS variable value from body.dark
            bodyColor = getComputedStyle(document.body).getPropertyValue('--app-color-notification');
        } else {
            
            // Get the CSS variable value from root
            bodyColor = getComputedStyle(root).getPropertyValue('--app-color-notification');
        }
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
    <div class="notification-card">
        <div class="row-header">
            <div class="left-col">
                <div class="icon-wrapper">
                     <img alt="Service logo" src={notification.type == "universis" ? universisLogo : notification.type == "webmail" ? mail : elearningLogo} />
                </div>
                <div class="details">
                    <span class="sender">{notification.sender}</span>
                    <span class="time">{timeSinceDate(notification.dateReceived, getLocale())}</span>
                </div>
            </div>
        </div>
        <div class="row-content">
            <p class="subject">{notification.subject}</p>
        </div>
    </div>
</div>

<!-- Modal which displays when clicked, showing the detailed contents of the notification -->
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
                    <div class="context-chips ion-padding-horizontal">
                        <ion-chip style="flex-shrink: 2;" outline color={notification.type == "universis" ? "tertiary" : notification.type == "webmail" ? "secondary" : "warning"}>
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
                            <ion-chip color="primary" on:click={()=>{window.location = notification.url}} aria-hidden>
                                <ion-icon icon={open} ></ion-icon>
                                <ion-label>{$t('notifications.open')}</ion-label>
                            </ion-chip>
                        {/if}
                    </div>
                    <ion-item-divider>
                        <ion-label>{$t('notifications.description')} </ion-label>
                      </ion-item-divider>                    
                    <ion-item lines="none" class="item-text-wrap ion-no-padding">
                        <iframe bind:this={iframe}
                        title="Body"
                        srcdoc={content}
                        src="about:blank"
                        style="width: 100%; border: none;"/>
                    </ion-item>
                    <ion-item-divider >
                        <ion-label>{$t('notifications.date')}: {notification.dateReceived.toLocaleString()}</ion-label>
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

        .context-chips{
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }

        .notification-card {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .row-header {
            display: flex;
            align-items: center;
        }

        .left-col {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            overflow: hidden;
        }

        .icon-wrapper {
            background: var(--ion-color-step-50, #f4f5f8);
            border-radius: 12px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 8px;
        }

        .icon-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .details {
            display: flex;
            flex-direction: column;
            gap: 2px;
            overflow: hidden;
        }

        .sender {
            font-weight: 600;
            font-size: 0.95rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--ion-text-color);
            display: block;
        }

        .time {
            font-size: 0.75rem;
            color: var(--ion-color-medium);
        }

        .row-content {
            margin-top: 8px;
        }

        .subject {
            margin: 0;
            font-size: 0.95rem;
            color: var(--ion-text-color);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .card-link {
            display: block;
            text-decoration: none;
            cursor: pointer;
        }

</style>