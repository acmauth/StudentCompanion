<script lang="ts">

    import SwipeCard from "./swipeCard.svelte";
    import RecentGrade from "./recentGrades.svelte";
    import Notification from "$components/notifications/notification.svelte";
    import { dismissedItems } from "./dismissedItems";
    import { refresh } from "ionicons/icons";
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';
    import {t} from "$lib/i18n";


    export let recentItems: any[] = [];
    export let maxCards = 6;
    let recentlyDismissedItem: any;
    let allRecentItems: any[] = [];
    let showUndoButton = false;
    let timer: any;
    filterRecentItems();

    //Adding the exam to the dismissed items
    function addToDismissedItems(id: number){
        dismissedItems.update(ids => [...ids, id]);
        recentlyDismissedItem = id;
    }

    // Removing the exam from the dismissed items
    function removeFromDismissedItems(id: number){
        dismissedItems.update((items) => items.filter((item) => false));
    }

    // remove card when swipped
    const deleteCard = (id: { detail: number }) => {
        const examId = id.detail;
        recentItems = recentItems.filter((item) => item.id !== examId);
        addToDismissedItems(examId);
        showUndoButton = true;
    }

    // restore the most recently deleted card when undo button is pressed
    function restoreDeletedCard(){
        removeFromDismissedItems(recentlyDismissedItem);
        for (const recentItem of allRecentItems){ //allRecentItems include the deleted ones
            if (recentlyDismissedItem === recentItem.id){
                recentItems = [...recentItems, recentItem];
                //geting the deleted card to its previous position
                let temp = [];     
                for (const item of allRecentItems){
                    if (recentItems.includes(item)){
                        temp.push(item);
                    }
                }
                recentItems = [...temp]; //To force svelte to rerender the component
                hideUndoButton();
                return;
            }
        }       
    }

    function hideUndoButton() {
        showUndoButton = false;
        clearTimeout(timer);
    }

    function handleInteraction(event: any) {
        if (event.target.closest('.undoButton')) {
            return; // Ignore interaction if it is the undo button
        }
        hideUndoButton();
        removeEventListeners();     
    }

    // adding event listeners for every possible event
    function addEventListeners() {
        document.addEventListener('touchstart', handleInteraction);
        document.addEventListener('touchmove', handleInteraction);
        document.addEventListener('focus', handleInteraction, true); // true to capture event during capturing phase
    }

    function removeEventListeners() {
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('touchmove', handleInteraction);
        document.removeEventListener('focus', handleInteraction, true);
    }

    // adding event listeners if undo button appears
    $: if (showUndoButton) {
        addEventListeners();
        timer = setTimeout(hideUndoButton, 8000); //Hide button after 8 seconds
    } else {
        removeEventListeners();
        clearTimeout(timer);
    }

    function filterRecentItems(){
        allRecentItems= [...recentItems];

        // removing from recentGrades the exams that are already deleted
        for (const recentItem of recentItems){           
            if ($dismissedItems.includes(recentItem.id)){
                recentItems = recentItems.filter((item) => item.id !== recentItem.id);
            }
        }
        
        // sorting the recentItems by date descending
        recentItems = recentItems.sort((a, b) => {
            const getDate = (item: any) => {
                if (item.type === 'recentGrade') return new Date(item.content.gradeModified).getTime();
                if (item.type === 'notification') return new Date(item.content.dateReceived).getTime();
                return 0;
            };
            return getDate(b) - getDate(a);
        });

        // keeping the top maxCards items
        if (recentItems.length > maxCards){ 
            recentItems = recentItems.slice(0, maxCards); 
        }
    }

</script>

<div class="recentGrades ion-padding">
    
    {#if recentItems.length === 0}
            <p class="ion-padding" style="color: var(--ion-color-medium)">{$t('recentgrades.nonews')}</p>
    {:else}
        {#each recentItems as recentItem (recentItem.id)} 
            <div animate:flip={{ duration: 500, easing: quintOut }}>
                <SwipeCard id={recentItem.id} on:delete-card={deleteCard} > 
                    {#if recentItem.type === "recentGrade"}
                        <RecentGrade subject={recentItem.content}/>
                    {:else}
                        <Notification notification={recentItem.content}/>
                    {/if}
                </SwipeCard>
            </div>
        {/each}
    {/if}

    <div class="button-container">
        {#if showUndoButton}
          <ion-button class="undoButton ion-padding" on:click={restoreDeletedCard} aria-hidden><ion-icon icon={refresh}></ion-icon></ion-button>
        {/if}
    </div>
    
</div>

<style>
    .recentGrades {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0;
    }

    .button-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 999;
    }
    .undoButton {
        --border-radius: 1rem;
        --box-shadow: var(--shadow-short-md);
    }
</style>