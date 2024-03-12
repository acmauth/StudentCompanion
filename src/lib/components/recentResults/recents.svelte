<script>
    import { gatherRecentGrades } from "./gatherRecentGrades"
    import { gatherNotifications } from "$components/notifications/notifications";
    import SwipeCard from "./swipeCard.svelte";
    import RecentGrade from "./recentGrades.svelte";
    import Notification from "$components/notifications/notification.svelte";
    import { dismissedGrades } from "$components/recentResults/dismissedGrades";
    import { onMount } from "svelte";
    import { refresh } from "ionicons/icons";
	import Course from "$components/degreeCalculator/course.svelte";

    /**
     * @type any[]
     */
    let recentItems = [];
    /**
     * @type any[]
     */
    let recentlyDismissedItems = [];
    /**
     * @type any[]
     */
    let storedItems = [];
    /**
     * @type any[]
     */
    let allRecentItems = [];

    // Subscribe to changes in dismissedGrades
    const unsubscribe = dismissedGrades.subscribe(value => {
        storedItems = value;
    });   

    /**
     * Adding the exam to the dismissed grades
	 * @param {any} id
	 */
    function addToDismissedItems(id){
        dismissedGrades.update(ids => [...ids, id]);
        recentlyDismissedItems = [...recentlyDismissedItems, id];
    }

    /**
     * Removing the exam from the dismissed grades
	 * @param {any} id
	 */
    function removeFromDismissedItems(id){
        dismissedGrades.update((items) => items.filter((item) => item !== id));
    }

    // remove card when swipped
    const deleteCard = (/** @type {{ detail: number; }} */ id) => {
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

    onMount(async () => {

        let notifications = await gatherNotifications({days: 7});
        let recentGrades = await gatherRecentGrades();

        // @ts-ignore
        recentItems = recentItems.concat(notifications.map( (notification) => {return {
            type: "notification", 
            content: notification,
            id: notification.id
        }}),
        // @ts-ignore
        recentGrades.map( ( recentGrade ) => {return {
            type: "recentGrade",
            content: recentGrade,
            id: recentGrade.courseExam.id
        }}));

        allRecentItems = [...recentItems];

        // removing from recentGrades the exams that are already deleted
        for (const recentItem of recentItems){           
            if (storedItems.includes(recentItem.id)){
                recentItems = recentItems.filter((item) => item.id !== recentItem.id);
            }
        }
    });
</script>


<div class="recentGrades ion-padding">

    {#if recentItems.length === 0}
            <p class="ion-padding">Δεν υπάρχουν πρόσφατα</p>
    {:else}
        {#each recentItems as recentItem } 
            {#if recentItem.type === "recentGrade"}
                <SwipeCard id={recentItem.id} on:delete-card={deleteCard} > 
                    <RecentGrade subject={recentItem.content}/>
                </SwipeCard>
            {/if}
        {/each}

        {#each recentItems as recentItem } 
            {#if recentItem.type === "notification"}
                <SwipeCard id={recentItem.id} on:delete-card={deleteCard}>
                    <Notification notification={recentItem.content}/>
                </SwipeCard>
            {/if}
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
