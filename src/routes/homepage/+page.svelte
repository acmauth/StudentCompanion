<script>
	import IonPage from "ionic-svelte/components/IonPage.svelte";
    import AppCard from "$shared/AppCard.svelte";

</script>

<IonPage>
    <ion-header>
        <ion-toolbar>
            <ion-title>Home</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        
        <AppCard colour="primary" padding>
            <h1>This is a test</h1>
            <ion-avatar>
                <ion-skeleton-text animated style="width: 100%; height: 100%;"></ion-skeleton-text>
            </ion-avatar>
        </AppCard>
        
        <AppCard colour="orange">
            <h1>This is a test</h1>
        </AppCard>
        
        <AppCard colour="green">
            <h1>This is a test</h1>
        </AppCard>
        
        <AppCard colour="purple">
            <h1>This is a test</h1>
        </AppCard>
        
        <AppCard>
            <h1>This is a test</h1>
        </AppCard>
    </ion-content>
</IonPage>