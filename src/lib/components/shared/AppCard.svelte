<script lang="ts">
    import type {Colour} from "$types/colours"
    export let colour: Colour = "default";
    export let padding: boolean = false;
    export let innerClass = $$props.class;
    export let onClick = () => {}

    let paddingstr = padding ? "padding: 1rem;" : "";

</script>

{#if colour === "default"}
    <ion-card class="{innerClass}" on:click={onClick} aria-hidden>
        <slot/>
    </ion-card>
{:else}
    <ion-card class="{innerClass}" on:click={onClick} aria-hidden style="--background: var(--app-color-{colour})!important; --color: var(--app-color-{colour}-dark);{paddingstr}">
        <slot/>
    </ion-card>
{/if}
