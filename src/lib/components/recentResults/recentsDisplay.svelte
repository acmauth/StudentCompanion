<script lang="ts">

    import SwipeCard from "./swipeCard.svelte";
    import RecentGrade from "./recentGrades.svelte";
    import Notification from "$components/notifications/notification.svelte";
    import { dismissedItems } from "$components/recentResults/dismissedItems";
    import { refresh } from "ionicons/icons";
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';

    
    export let recentItems: any[] = [];
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

    // restore the most recently deleted card when restore button is pressed
    function restoreDeletedCard(){
        removeFromDismissedItems(recentlyDismissedItem);
        for (const recentItem of allRecentItems){
            if (recentlyDismissedItem === recentItem.id){
                recentItems = [...recentItems, recentItem];
                let temp = [];     
                for (const item of allRecentItems){
                    if (recentItems.includes(item)){
                        temp.push(item);
                    }
                }
                recentItems = [...temp]; //To force svelte to rerender the component
                return;
            }
        }
        showUndoButton = false;
    }

    function hideUndoButton() {
        showUndoButton = false;
        clearTimeout(timer);
    }

    function handleInteraction(event) {
        if (event.target.closest('.undoButton')) {
            return; // Ignore interaction if it is the undo button
        }
        showUndoButton = false;
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
        
        // sorting the recentItems so that the recentGrades are always first
        recentItems = recentItems.sort((a, b) => {
            if (a.type === "recentGrade" && b.type === "notification") return -1;
            if (a.type === "notification" && b.type === "recentGrade") return 1;
            return 0;
        });

        // keeping all the recent grades and removing the excess notifications
        const maxNumOfCard = 6;
        const numOfGrades = recentItems.filter((recentItem) => recentItem.type === "recentGrade").length;
        
        if (numOfGrades+3 > maxNumOfCard){ // ensuring that there are always at least 3 notifications
            recentItems = recentItems.slice(0, numOfGrades+3); 
        } else {
            recentItems = recentItems.slice(0, maxNumOfCard); // can do that because recent grades are stored first
        }
    }

</script>

<div class="recentGrades ion-padding">
    
    {#if recentItems.length === 0}
            <p class="ion-padding">Δεν υπάρχουν πρόσφατα</p>
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