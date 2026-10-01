<script lang="ts">
  import { t } from "$lib/i18n";
  import SubPageHeader from '$shared/subPageHeader.svelte';
  import IonPage from 'ionic-svelte/components/IonPage.svelte';



</script>

<IonPage>
<SubPageHeader title="Secret" stackedNav/>
<ion-content class="ion-padding">
    <p>Γειά :)</p>
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/track/4PTG3Z6ehGkBFwjybzWkR8?utm_source=generator&si=bc90b64a65d848d8" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</ion-content>
</IonPage>

<style>

</style>
