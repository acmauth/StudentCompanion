<script lang="ts">
  import VectorGreece from "$lib/components/language/Greece.svg"
  import VectorUK from "$lib/components/language/UK.svg"
  import { changeLocale, t } from '$lib/i18n';

  export let isOpen = false;

  function flagClick(lang: string)
  {
    document.cookie = `lang=${lang};` // for some reason, homepage will go to default locale without this line.
    changeLocale(lang); // use '$locale' to get the current locale
    isOpen = false;
  }

    
</script>

<ion-modal
	is-open={isOpen}
	on:ionModalDidDismiss={() => { isOpen = false; }}
	class="add-qr-modal">
	<div class="add-qr-modal-content">
  <div class="language_select">
    <div class="option ion-activatable" on:click={() => {flagClick("el")}} aria-hidden>
    <ion-ripple-effect/>
      <img src={VectorGreece} alt="Greece">
      <p class = "flag-name">Ελληνικά</p>
    </div>
    <div class="option ion-activatable" on:click={() => {flagClick("en")}} aria-hidden>
    <ion-ripple-effect/>
      <img src={VectorUK} alt="English">
      <p class = "flag-name">English</p>
    </div>
  </div>
		<div class="modal-buttons">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<ion-button aria-hidden expand="block" mode="ios" color="dark" on:click={() => { isOpen = false; }} class="cancel-button">
				{$t('wallet.cancel')}
			</ion-button>
		</div>
	</div>
</ion-modal>

<!-- <ion-alert is-open={isOpen} onDidDismiss={() => {isOpen=false}}>
  <h1>test</h1>
          <img src={VectorGreece} alt="Greece">
        <p class = "flag-name">Ελληνικά</p>
                <img src={VectorUK} alt="English">
        <p class = "flag-name">English</p>
</ion-alert> -->

<style>

  .language_select {
    display:flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .option {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border-radius: 1rem;
    overflow: hidden;
  }

  .option img {
    aspect-ratio: 960 / 634;
    height: 67px;
    object-fit: cover;
    border-radius: 0.5rem;
  }

	.add-qr-modal {
		--width: 90%;
		--height: auto;
		--border-radius: 1.5rem;
		--backdrop-opacity: 0.6;
	}

	.add-qr-modal-content {
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		background: var(--app-color-map-input);
		border-radius: 1.5rem;
	}
</style>