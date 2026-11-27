<script lang="ts">
	import type { notification } from "./notifications";
    import universisLogo from "$images/universis.png";
    import elearningLogo from "$images/elearning.png";
    import aristomateLogo from "$images/aristomate.png";
    import webmailLogo from "$images/mail.png";
    import { open } from 'ionicons/icons';
    import BottomSheet from "$components/shared/BottomSheet.svelte";
    import timeSinceDate from "$lib/globalFunctions/getTimeSinceDate";
    import DOMPurify from 'dompurify';
	import { onMount } from "svelte";
    import { t, getLocale } from "$lib/i18n";

    export let notification: notification;

    const OPTIONS: Record<string, {colour: string, logo: string, cssClass: string}> = {
        "universis": {colour: "tertiary", logo: universisLogo, cssClass: "universis"},
        "aristomate": {colour: "tertiary", logo: aristomateLogo, cssClass: "universis"},
        "webmail": {colour: "secondary", logo: webmailLogo, cssClass: "webmail"},
        "elearning": {colour: "warning", logo: elearningLogo, cssClass: "elearning"},
        undefined: {colour: "tertiary", logo: aristomateLogo, cssClass: "universis"}
    }

    $: option = OPTIONS[notification.type] ?? OPTIONS.undefined;


    let iframe: HTMLIFrameElement | undefined;
    let inlineModalOpen = false;

    let content = DOMPurify.sanitize(notification.body, {SANITIZE_NAMED_PROPS: true}).trim().replace(/\s+/g, ' ').replace(/\s+/g, ' ');

    // Adding an event listener to the iframe to set the height of the iframe to the content of the iframe
    onMount(() => {
        iframe?.addEventListener('load', onMailLoad);
    });


    // Fixing the height of the iframe
    function fixIframeHeight() {
        const body = iframe?.contentWindow?.document.body;
        if (iframe && body){
            iframe.style.height = body.scrollHeight + 100 + 'px';
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


<div aria-hidden on:click ={() => {inlineModalOpen = true}} class="card-link">
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
<BottomSheet
    bind:isOpen={inlineModalOpen}
    title={notification.subject}
    subtitle={timeSinceDate(notification.dateReceived, getLocale())}
    titleLines={2}
    actionIcon={open}
    actionLabel={$t('notifications.open')}
    onAction={notification.url ? () => { window.location.href = notification.url; } : undefined}
    handleBehavior="cycle"
    on:ionModalWillPresent={fixIframeContent}
>
    <!-- Sender -->
    <section class="sheet-group sender-card">
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
    <section class="sheet-group mail-body">
        <iframe bind:this={iframe}
            title={$t('notifications.description')}
            srcdoc={content}
            src="about:blank"></iframe>
    </section>
</BottomSheet>

    <style>
        /* ---------- Detail sheet (frame and header come from BottomSheet) ---------- */
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