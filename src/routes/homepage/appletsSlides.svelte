<script>
    import AppCard from "$shared/AppCard.svelte";
    import { fastFood, map, link } from "ionicons/icons";
</script>

<ion-content scroll-x={true} scroll-y={false} style="max-height: 6.5rem" class="ion-padding scrollingApplets">
    <div class="applets">
    <AppCard colour="orange" margin={false} shadow={false} class="applet" maxWidth="9rem">
        <div class="appletcontent">
            <ion-icon icon={fastFood}></ion-icon>
            <ion-label>Μενού Λέσχης</ion-label>
        </div>
    </AppCard>
    <AppCard colour="green" margin={false} shadow={false} class="applet" maxWidth="9rem">
        <div class="appletcontent">
            <ion-icon icon={map}></ion-icon>
            <ion-label>Χάρτης ΑΠΘ</ion-label>
        </div>
    </AppCard>
    <AppCard colour="purple" margin={false} shadow={false} class="applet" maxWidth="9rem">
        <div class="appletcontent">
            <ion-icon icon={link}></ion-icon>
            <ion-label>Σύνδεσμοι</ion-label>
        </div>
    </AppCard>
    </div>
</ion-content>

<style>
    .applets {
        /* display: inline-flex;
        flex-direction: row;
        align-items: flex-start; */
        /* overflow-x: scroll !important; */
        /* gap: 1rem;
        white-space: nowrap; */
        
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 1rem;
        width: max-content;
        
    }

    .scrollingApplets {
        /* --offset-bottom: 0.5rem!important;
        --overflow: scroll-x!important;
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        } */
    }

    .appletcontent {
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: center;
        gap: 0.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        width: 9rem;
    }
    .appletcontent ion-icon {
        font-size: 2rem;
    }
    .appletcontent ion-label {
        font-size: 1rem;
    }
</style>