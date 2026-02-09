<script lang="ts">
    import osethLogo from '$lib/assets/oseth.svg';
    import campusSafetyLogo from '$lib/assets/campus-safety.png';
    import { getMetroInfo } from '$lib/metroScraper/scraper';
    import { handleTransportAppClick } from "./helper";
    import { onMount } from "svelte";

    let isDarkMode = false;

    onMount(() => {
        if (typeof window !== 'undefined') {
            isDarkMode = document.body.classList.contains('dark');
        }
    });
</script>

<div class="footer-section">
    <div class="marquee-container">
        <div class="marquee-text" class:dark={isDarkMode}>
            {#await getMetroInfo() then metroInfo}
                {#if isDarkMode}
                    Metro: {metroInfo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}
                {:else}
                    <strong>Metro:</strong> {metroInfo}
                {/if}
            {:catch error}
                <span>Error loading metro info</span>
            {/await}
        </div>
    </div>

    <div class="button-container">
        <div style="width:0.2rem; align-self:stretch; background-color:grey; margin:0.2rem;" />

        <ion-card
            on:click={handleTransportAppClick}
            class="button-card"
            aria-label="OASTH Transport Services"
            aria-hidden
        >
            <img src={osethLogo} alt="OSETH services" class="button-image" />
        </ion-card>
    </div>
</div>

<style>
    .footer-section {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: fit-content;
        background-color: var(--ion-color-light);
        display: flex;
        align-items: center;
        z-index: 2;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .marquee-container {
        width: 90%;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
    }

    .marquee-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }

    .marquee-text {
        display: inline-block;
        width: auto;
        padding-block: 0.8rem;
        padding-inline: 0.8rem;
        animation: marquee 15s linear infinite;
        position: relative;
        z-index: 2;
        font-size: 0.9rem;
        color: var(--ion-text-color, #000);
    }

    .marquee-text.dark {
        color: #ff8c00;
        font-family: 'Press Start 2P', monospace;
        font-weight: 400;
        letter-spacing: 0.1em;
        text-shadow: 0 0 10px rgba(255, 140, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.4),
            0 0 30px rgba(255, 140, 0, 0.2);
        text-transform: uppercase;
    }

    .marquee-text strong {
        color: var(--ion-text-color, #000);
    }

    .marquee-text.dark strong {
        color: #ffa500;
        letter-spacing: 0.1em;
        text-shadow: 0 0 10px rgba(255, 165, 0, 1), 0 0 20px rgba(255, 165, 0, 0.6);
    }

    @keyframes marquee {
        0% {
            transform: translateX(50%);
        }
        100% {
            transform: translateX(-100%);
        }
    }

    .button-container {
        min-width: 10%;
        height: 100%;
        display: flex;
        justify-content: end;
        gap: 0.3rem;
        align-items: end;
        padding: 0.3rem;
    }

    .button-card {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: end;
        justify-content: end;
        margin: 0;
        padding: 0;
        background-color: white;
        border-color: grey;
        border-width: 0.1rem;
        border-style: solid;
        max-height: 40px;
        max-width: 40px;
    }

    .button-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        aspect-ratio: 1;
    }
</style>
