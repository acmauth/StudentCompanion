<script lang='ts'>
  import { onMount } from 'svelte';
  // import QRCode from 'qrcode-generator';
  import QRCode from 'qrcode'
	import type { qrItem } from './qrItem';
  
  export let qr1: qrItem;

  onMount(() => {
    const qrCodeElement = document.getElementById(qr1.data);
    QRCode.toCanvas(qrCodeElement, qr1.data, { width: 200, height: 200 });
  });
</script>


<div style="display: flex; flex-direction: column; align-items: center;">
  <ion-label>{qr1.title}</ion-label>
  <canvas style="padding:0; margin:0;" id="{qr1.data}"></canvas>
</div>
