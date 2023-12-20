<script>
	import IonPage from "ionic-svelte/components/IonPage.svelte";
    import AppCard from "$shared/AppCard.svelte";
    import AppletsSlides from "./appletsSlides.svelte";

</script>

<IonPage>
    <ion-header>
        <ion-toolbar>
            <ion-title>Home</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="" fullscreen>
        <AppletsSlides/>
        <p>This is a rather long test so I can test wether it screenwraps</p>
    </ion-content>
</IonPage>

