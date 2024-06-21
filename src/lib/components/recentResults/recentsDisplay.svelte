<script lang="ts">

    import SwipeCard from "./swipeCard.svelte";
    import RecentGrade from "./recentGrades.svelte";
    import Notification from "$components/notifications/notification.svelte";
    import { dismissedItems } from "$components/recentResults/dismissedItems";
    import { onMount } from "svelte";
    import { refresh } from "ionicons/icons";
    import { flip } from "svelte/animate";
    import { quintOut } from 'svelte/easing';

    export let recentItems: any[] = [];
    
    let recentlyDismissedItems: any[] = [];
    let allRecentItems: any[] = [];
    filterRecentItems();


    //Adding the exam to the dismissed items
    function addToDismissedItems(id: number){
        dismissedItems.update(ids => [...ids, id]);
        recentlyDismissedItems = [...recentlyDismissedItems, id];
    }

    // Removing the exam from the dismissed items
    function removeFromDismissedItems(id: number){
        dismissedItems.update((items) => items.filter((item) => item !== id));
    }

    // remove card when swipped
    const deleteCard = (id: { detail: number }) => {
        const examId = id.detail;
        recentItems = recentItems.filter((item) => item.id !== examId);
        addToDismissedItems(examId);
    }

    // restore the most recently deleted card when restore button is pressed
    function restoreDeletedCard(){
        let id = recentlyDismissedItems[recentlyDismissedItems.length - 1];
        recentlyDismissedItems = recentlyDismissedItems.slice(0, -1);
        removeFromDismissedItems(id);
        for (const recentItem of allRecentItems){
            if (id === recentItem.id){
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
        {#if recentlyDismissedItems.length > 0}
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