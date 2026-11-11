<script lang="ts">
    import type { Snippet } from 'svelte';
    import type {Colour} from "$types/colours"

    interface Props {
        colour?: Colour;
        padding?: boolean;
        margin?: boolean;
        shadow?: boolean;
        maxWidth?: string;
        /** CSS class(es) applied to the inner ion-card */
        class?: string;
        onClick?: () => void;
        href?: string;
        children?: Snippet;
        // other attributes passed by callers (e.g. id) are accepted and ignored, as before
        [key: string]: unknown;
    }

    let {
        colour = "default",
        padding = false,
        margin = true,
        shadow = true,
        maxWidth = "100%",
        class: innerClass = undefined,
        onClick = () => {},
        href = "",
        children
    }: Props = $props();

    let paddingstr = $derived(padding ? "padding: 1rem;" : "");
    let marginstr = $derived(margin ? "" : "margin: 0 !important;");
    let shadowstr = $derived(shadow ? "" : "box-shadow: none !important;");
    let maxWidthstr = $derived(maxWidth ? `max-width: ${maxWidth}!important;` : "");

</script>

{#if colour === "default"}
    <ion-card href={href} class="{innerClass}" onclick={onClick} aria-hidden style="{paddingstr}{marginstr}{shadowstr}{maxWidthstr}">
        {@render children?.()}
    </ion-card>
{:else}
    <ion-card href={href} class="{innerClass}" onclick={onClick} aria-hidden style="--background: var(--app-color-{colour})!important; --color: var(--app-color-{colour}-dark);border: none !important;{paddingstr}{marginstr}{shadowstr}{maxWidthstr}">
        {@render children?.()}
    </ion-card>
{/if}
