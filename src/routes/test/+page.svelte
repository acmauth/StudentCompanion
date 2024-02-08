<script>
	import { IonContent } from "@ionic/core/components/ion-content";
    import AppCard from "$components/shared/AppCard.svelte";
    import FlipCard from "./flipCard.svelte";

</script>

<ion-content>
    <FlipCard reactToHeight>
        <AppCard slot="front">
            <ion-card-header>
                <ion-card-subtitle>Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-text>Homepage</ion-text>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
        <AppCard colour="orange" slot="back">
            <ion-card-header>
                <ion-card-subtitle>SECONDDDDD Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-button href="/loginservice">Homepage</ion-button>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
    </FlipCard>
    <FlipCard reactToHeight>
        <AppCard slot="front">
            <ion-card-header>
                <ion-card-subtitle>Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-text>Homepage</ion-text>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
        <AppCard colour="orange" slot="back">
            <ion-card-header>
                <ion-card-subtitle>SECONDDDDD Student companion (test) homepage</ion-card-subtitle>
            </ion-card-header>
            <ion-button href="/loginservice">Homepage</ion-button>
            <ion-card-content>
                Let's list here our quick page links, before we get navigation figured out
            </ion-card-content>
            <ion-button href="/loginService">Log in/Log out</ion-button>
        </AppCard>
    </FlipCard>
</ion-content>

