<script>
    import AppCard from "$components/shared/AppCard.svelte";
    import { flipped } from "./flipstore";
</script>

<AppCard>
    <ion-card-header>
        <ion-card-subtitle>Student companion (test) homepage</ion-card-subtitle>
    </ion-card-header>
    <ion-text>Homepage</ion-text>
    <ion-card-content>
        Let's list here our quick page links, before we get navigation figured out
        <ion-chip on:click={() => {$flipped = !$flipped}} aria-hidden>This is some text</ion-chip>
    </ion-card-content>
    <ion-button href="/loginService">Log in/Log out</ion-button>
</AppCard>