<script lang="ts">
    import type {Colour} from "$types/colours"
    export let colour: Colour = "default";
    export let padding: boolean = false;
    export let margin: boolean = true;
    export let shadow: boolean = true;
    export let maxWidth: string = "100%";
    export let innerClass = $$props.class;
    export let onClick = () => {}

    let paddingstr = padding ? "padding: 1rem;" : "";
    let marginstr = margin ? "" : "margin: 0 !important;";
    let shadowstr = shadow ? "" : "box-shadow: none !important;";
    let maxWidthstr = maxWidth ? `max-width: ${maxWidth}!important;` : "";

</script>

{#if colour === "default"}
    <ion-card class="{innerClass}" on:click={onClick} aria-hidden style="{paddingstr}{marginstr}{shadowstr}{maxWidth}">
        <slot/>
    </ion-card>
{:else}
    <ion-card class="{innerClass}" on:click={onClick} aria-hidden style="--background: var(--app-color-{colour})!important; --color: var(--app-color-{colour}-dark);border: none !important;{paddingstr}{marginstr}{shadowstr}{maxWidthstr}">
        <slot/>
    </ion-card>
{/if}
