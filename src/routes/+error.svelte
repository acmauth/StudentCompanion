<script>
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    $: errorStatus = $page.status;
    $: errorMessage = $page.error?.message || "An unexpected error occurred.";
</script>

<ion-content class="ion-padding ion-text-center">
    <h1>Error {errorStatus}</h1>
    <p>{errorMessage}</p>
    <p>{$page.url}</p>
    <ion-button on:click={() => goto('/pages/homepage')}>Go to Homepage</ion-button>
</ion-content>