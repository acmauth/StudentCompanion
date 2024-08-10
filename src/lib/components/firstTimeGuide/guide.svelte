<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let modalElement;

  onMount(() => {
    modalElement.present();
  });

  function dismiss() {
    modalElement.dismiss();
    goto("/pages/homepage");
  }
</script>

<ion-modal bind:this={modalElement}>
  <div class="modal-content">
    <h1>Guide Placeholder</h1>
    <ion-button on:click={dismiss}>Close</ion-button>
  </div>
</ion-modal>

<style>
  .modal-content {
    padding: 16px;
    text-align: center;
  }

  h1 {
    margin-bottom: 16px;
  }
</style>

