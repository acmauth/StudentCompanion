<script lang="ts">
	import type { notification as NotificationData } from "./notifications";
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import aristomateLogo from "$images/aristomate.png";
    import webmailLogo from "$images/mail.png";
    import { open, close } from 'ionicons/icons';
    import timeSinceDate from "$lib/globalFunctions/getTimeSinceDate";
    import DOMPurify from 'dompurify';
	import { onMount, onDestroy } from "svelte";
    import { t, getLocale } from "$lib/i18n";

    interface Props {
        notification: NotificationData;
    }

    let { notification }: Props = $props();

    const OPTIONS: Record<string, {colour: string, logo: string, cssClass: string}> = {
        "universis": {colour: "tertiary", logo: universisLogo, cssClass: "universis"},
        "aristomate": {colour: "tertiary", logo: aristomateLogo, cssClass: "universis"},
        "webmail": {colour: "secondary", logo: webmailLogo, cssClass: "webmail"},
        "elearning": {colour: "warning", logo: elearningLogo, cssClass: "elearning"},
        undefined: {colour: "tertiary", logo: aristomateLogo, cssClass: "universis"}
    }

    let option = $derived(OPTIONS[notification.type] ?? OPTIONS.undefined);


    let iframe: HTMLIFrameElement = $state();
    let inlineModalOpen = $state(false);
    let breakpoints = [0, 0.5, 1];
    
    const inlineModalDismissed = (val: any) => {inlineModalOpen = false;};

    let modalEl: HTMLIonModalElement | undefined = $state();

    // While presented, Ionic moves <ion-modal> under <ion-app>; if this card is removed while the
    // modal is open (e.g. the list re-renders), Svelte 5 can't remove it, so do it ourselves.
    onDestroy(() => {
        const el = modalEl;
        if (el && (el as any).presented) el.dismiss().catch(() => {}).finally(() => el.remove());
    });

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


    // Fixing the content of the iframe: app font, theme colours, links in a new tab
    function fixIframeContent(){
        const doc = iframe?.contentDocument;
        const html = doc?.documentElement;
        if (!doc || !html) return;

        // body inherits the :root value and body.dark overrides it, so this follows the current theme
        const themeStyles = getComputedStyle(document.body);
        const textColor = themeStyles.getPropertyValue('--app-color-notification').trim() || themeStyles.color;
        const linkColor = themeStyles.getPropertyValue('--ion-color-primary').trim() || textColor;

        html.style.fontFamily = "Roboto, sans-serif";
        html.style.overflowY = "hidden";

        // Force the email into the app's light/dark theme: many emails hard-code e.g. black text or
        // white table backgrounds, which become unreadable in dark mode. Images are kept;
        // background colours/images are dropped.
        // Email templates often use their own `!important` colour rules, so ours get extra specificity:
        // each :not(#_t) adds an ID's worth without matching anything special.
        const s = ':not(#_t):not(#_t):not(#_t)';
        let themeStyle = doc.getElementById('app-theme-override') as HTMLStyleElement | null;
        if (!themeStyle) {
            themeStyle = doc.createElement('style');
            themeStyle.id = 'app-theme-override';
            (doc.head ?? html).appendChild(themeStyle);
        }
        themeStyle.textContent = `
            html${s}, body${s} { background: transparent !important; color: ${textColor} !important; }
            body *${s} { color: inherit !important; -webkit-text-fill-color: currentColor !important; background-color: transparent !important; background-image: none !important; }
            body a${s}, body a *${s} { color: ${linkColor} !important; }
        `;

        // Inline `style="color: … !important"` beats any stylesheet, and old-school colour attributes
        // (<font color>, bgcolor, <body text>) are common in emails: strip colour styling at the source.
        for (const el of doc.querySelectorAll<HTMLElement>('[style], [color], [bgcolor], [text]')) {
            for (const prop of ['color', '-webkit-text-fill-color', 'background', 'background-color', 'background-image']) {
                el.style?.removeProperty(prop);
            }
            el.removeAttribute('color');
            el.removeAttribute('bgcolor');
            el.removeAttribute('text');
        }

        // Adding a base tag to the iframe to open links in a new tab instead of inside the iframe
        if (!doc.querySelector('base')) {
            const baseTag = doc.createElement('base');
            baseTag.target = '_blank';
            (doc.head ?? html).appendChild(baseTag);
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


<div aria-hidden onclick={() => {inlineModalOpen = true}} class="card-link">
    <div class="notification-card">
        <div class="row-header">
            <div class="left-col">
                <div class="icon-wrapper {option.cssClass}">
                     <img alt="Service logo" src={option.logo} />
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
      bind:this={modalEl}
      class="mail-sheet"
      is-open={inlineModalOpen}
      initial-breakpoint={0.5}
      {breakpoints}
      handle-behavior="cycle"
      onionModalWillPresent={fixIframeContent}
      onionModalDidDismiss={inlineModalDismissed}>
      <ion-header class="ion-no-border">
            <div class="sheet-header">
                <ion-button class="round-btn neutral" fill="solid" onclick={() => { inlineModalOpen = false; }} aria-label={$t('common.cancel')}>
                    <ion-icon slot="icon-only" icon={close}></ion-icon>
                </ion-button>
                <div class="sheet-titles">
                    <h2>{notification.subject}</h2>
                    <span>{timeSinceDate(notification.dateReceived, getLocale())}</span>
                </div>
                {#if notification.url}
                    <ion-button class="round-btn primary" fill="solid" onclick={() => { window.location = notification.url; }} aria-label={$t('notifications.open')}>
                        <ion-icon slot="icon-only" icon={open}></ion-icon>
                    </ion-button>
                {:else}
                    <span class="round-btn-spacer"></span>
                {/if}
            </div>
      </ion-header>
      <ion-content class="sheet-body">
            <!-- Sender -->
            <section class="group sender-card">
                <div class="icon-wrapper {option.cssClass}">
                    <img alt="Service logo" src={option.logo} />
                </div>
                <div class="sender-info">
                    <span class="sender">{notification.sender}</span>
                    {#if notification.email}
                        <a class="sender-email" href="mailto:{notification.email}">{notification.email}</a>
                    {/if}
                    <span class="full-date">{notification.dateReceived.toLocaleString(getLocale(), { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
            </section>

            <!-- Body -->
            <section class="group mail-body">
                <iframe bind:this={iframe}
                    title={$t('notifications.description')}
                    srcdoc={content}
                    src="about:blank"></iframe>
            </section>
      </ion-content>
</ion-modal>

    <style>
        /* ---------- Detail sheet (same style as the calendar event modal) ---------- */
        .mail-sheet {
            --border-radius: 1.5rem;
            --background: var(--ion-background-color, #fff);
            --box-shadow: rgba(100, 100, 111, 0.2) 0px -7px 29px 0px;
        }

        .mail-sheet ion-header {
            background: var(--ion-background-color, #fff);
        }

        .sheet-header {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 0.75rem;
            padding: 1.25rem 1rem 0.75rem;
        }

        .sheet-titles {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 0;
            text-align: center;
        }

        .sheet-titles h2 {
            margin: 0;
            max-width: 100%;
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.3;
            color: var(--ion-text-color);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            overflow-wrap: anywhere;
        }

        .sheet-titles span {
            margin-top: 0.15rem;
            font-size: 0.85rem;
            color: var(--ion-color-step-600, #999);
        }

        .round-btn {
            --border-radius: 50%;
            --padding-start: 0;
            --padding-end: 0;
            --box-shadow: none;
            width: 1.9rem;
            height: 1.9rem;
            margin: 0;
            font-size: 0.8rem;
        }

        .round-btn-spacer {
            width: 1.9rem; /* keeps the title centred when there is no "open" button */
        }

        .round-btn.neutral {
            --background: var(--ion-color-step-100, #e6e6e6);
            --background-activated: var(--ion-color-step-200, #ccc);
            --color: var(--ion-color-step-700, #4d4d4d);
        }

        .round-btn.primary {
            --background: var(--ion-color-primary);
            --color: var(--ion-color-primary-contrast, #fff);
        }

        .sheet-body {
            /* card surface: white on the light grey sheet, step-50 in dark mode */
            --group-bg: #fff;
            --background: var(--ion-background-color, #fff);
            --padding-start: 1rem;
            --padding-end: 1rem;
            --padding-bottom: 2rem;
        }

        :global(body.dark) .sheet-body {
            --group-bg: var(--ion-color-step-50, #1e1e1e);
        }

        .group {
            margin-bottom: 1rem;
            border-radius: 1rem;
            overflow: hidden;
            background: var(--group-bg);
        }

        .sender-card {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.85rem 0.9rem;
        }

        .sender-info {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
        }

        .sender-email {
            font-size: 0.85rem;
            color: var(--ion-color-primary);
            text-decoration: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .full-date {
            font-size: 0.78rem;
            color: var(--ion-color-medium);
        }

        .mail-body {
            padding: 0.25rem 0.5rem;
        }

        .mail-body iframe {
            display: block;
            width: 100%;
            border: none;
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
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 8px;
        }

        .icon-wrapper.universis {
            background: rgba(var(--ion-color-primary-rgb), 0.12);
        }

        .icon-wrapper.webmail {
            background: rgba(var(--ion-color-secondary-rgb), 0.12);
        }

        .icon-wrapper.elearning {
            background: rgba(var(--ion-color-warning-rgb), 0.15);
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