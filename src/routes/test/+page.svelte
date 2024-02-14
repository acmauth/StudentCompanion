<script>
  import { IonModal, IonDatetime } from '@ionic/svelte';
</script>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/@ionic/core@latest/dist/ionic/ionic.esm.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@latest/css/core.css" integrity="sha384-2UmkhP8I7Svk/3qgoS+QAPmVzNfLRJVL9txzo5Z+5fFDK9LPYDZAcHbu+to7C2VX" crossorigin="anonymous">
</svelte:head>

<svelte:body>
  <IonDatetimeButton bind:datetime={datetime}></IonDatetimeButton>

  <IonModal keepContentsMounted={true}>
    <IonDatetime bind:value={datetime}></IonDatetime>
  </IonModal>
</svelte:body>
