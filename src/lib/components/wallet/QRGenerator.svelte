<script lang='ts'>
  import { onMount } from 'svelte';
  import QRCode from 'qrcode'
	import type { qrItem } from './qrItem';
  import { alertController } from 'ionic-svelte';
  import { qrStore } from './qrStore';
	import { goto } from '$app/navigation';
	import { reload } from 'ionicons/icons';

  export let qr1: qrItem;

  onMount(() => {
    const qrCodeElement = document.getElementById(qr1.data);
    QRCode.toCanvas(qrCodeElement, qr1.data, { width: 300, height: 300 });
  });

  const showAlert = async (options) => {
    const alert = await alertController.create(options);
    await alert.present();
  };

  function deleteQR() {
    const options = {
      header: 'Αφαίρεση QR;',
      message: 'Θέλεις να αφαιρεθεί το QR από το πορτοφόλι σου;',
      buttons: [{
            text: 'ΟΧΙ',
            role: 'cancel',
            handler: () => {
               return;
            }
         },
         {
            text: 'ΝΑΙ',
            role: 'confirm',
            handler: () => {
              qrStore.update((store) => store.filter((item) => item.data !== qr1.data));
            }
         }]
    };
    showAlert(options);
  }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ion-div on:click={deleteQR}>
    <canvas id="{qr1.data}"></canvas>
    <ion-label>{qr1.title}</ion-label>     
</ion-div>

<style>
  ion-div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>