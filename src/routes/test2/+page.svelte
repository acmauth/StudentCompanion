<script lang="ts">
    import { onMount } from 'svelte';
    
    let outlet: HTMLIonRouterOutletElement;
    let page1: HTMLDivElement;
    let page2: HTMLDivElement;
    const testList = ["Element 1", "Element 2", "Element 3", "Element 4", "Element 5", "Element 6", "Element 7", "Element 8", "Element 9", "Element 10", "Element 11"];
    // to run when the component is mounted
    onMount(() => {
        outlet.commit(page1, undefined);
    });

    function transitionPage() {
        outlet.commit(page2, page1);
    }

    function popPage() {
        outlet.commit(page1, page2);
    }
</script>

<div class="ion-page ion-page-invisible" bind:this={page2}>
    <ion-header>
        <ion-toolbar>
            <ion-title>Page 2</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-chip on:click={popPage} aria-hidden>test</ion-chip>
    </ion-content>
</div>

<div class="ion-page" bind:this={page1}>
    <ion-header>
        <ion-toolbar>
            <ion-title>Page 1</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <ol>
            {#each testList as testItem}
                <li>
                    <h1>
                        {testItem}
                        {testItem}
                    </h1>
                    {testItem}
                </li>
            {/each}
        </ol>
        <ion-chip on:click={transitionPage} aria-hidden>test</ion-chip>
    </ion-content>
</div>

<ion-router-outlet bind:this={outlet} />