<script lang="ts">
    import { gatherRecentGrades } from "./gatherRecentGrades"
    import { gatherNotifications } from "$components/notifications/notifications";
    import RecentsDisplay from "./recentsDisplay.svelte";
    import { onMount } from "svelte";


    const recentItemsFromCache: any[] = getCachedRecentItems();


    function cacheRecentItems(recentItems: any[]){
        localStorage.setItem("recentItems", JSON.stringify(recentItems));
    }

    function getCachedRecentItems(){
        let cachedItems = localStorage.getItem("recentItems");
        if(cachedItems){
            return JSON.parse(cachedItems);
        }
        return [];
    }

    async function gatherRecentItems(){
        let notifications = await gatherNotifications({days: 7});
        let recentGrades = await gatherRecentGrades();
        
        let recentItems: any[] = [];
        
        // @ts-ignore
        recentItems = recentItems.concat(recentGrades.map( ( recentGrade ) => {return {
            type: "recentGrade",
            content: recentGrade,
            id: recentGrade.courseExam.id
        }}),
        // @ts-ignore
        notifications.map( (notification) => {return {
            type: "notification", 
            content: notification,
            id: notification.id
        }}));

        cacheRecentItems(recentItems);
        return recentItems;
    
    }

</script>


{#await gatherRecentItems()}
    <!-- <ion-progress-bar type="indeterminate"/> -->
    <RecentsDisplay recentItems={recentItemsFromCache}/>
{:then recentItemsList}
    <RecentsDisplay recentItems={recentItemsList}/>
{/await}
<!-- {:catch error}
    <p class="ion-padding">Σφάλμα: {error.message}</p>
{/await} -->

