<script lang="ts">
    // import function to register Swiper custom elements
    import { register } from 'swiper/element/bundle';
    import { Navigation, Pagination } from 'swiper/modules';
    // register Swiper custom elements
    import intro  from '$lib/assets/guide_graphics/intro.png'; 
    import cafeteria from '$lib/assets/guide_graphics/cafeteria.png';
    import campusMap from '$lib/assets/guide_graphics/campus map.png';
    import gym from '$lib/assets/guide_graphics/gym.png';
    import grades from '$lib/assets/guide_graphics/grades.png'
    import stats from '$lib/assets/guide_graphics/stats.png'; 
    import notifications from '$lib/assets/guide_graphics/notifications.png'; 
    import calendar from '$lib/assets/guide_graphics/calendar.png'; 
    import darkmode from '$lib/assets/guide_graphics/darkmode.png'
    import { fade, blur } from 'svelte/transition';
    import {onMount} from 'svelte';
    
    register();
    
    const images = [intro, cafeteria, campusMap, gym, grades, stats, notifications, calendar, darkmode];
    
    let activeIndex = 0;
    let swiperEl: any;
    onMount(() => {
        const params = {
            injectStyles: [`.swiper-pagination {position:relative;}`],
        }

        Object.assign(swiperEl, params);
        swiperEl.initialize();
    });

    function changeSlide(){
        activeIndex = swiperEl.swiper.activeIndex;
    }
  
</script>


<ion-content>
    <swiper-container init="false" bind:this={swiperEl} pagination="true" on:swiperslidechange={changeSlide}>
        {#each images as image, id}
                <swiper-slide>
                    <img src={image} alt="">
                </swiper-slide>
        {/each}        
    </swiper-container>
    {#key activeIndex}
        <div transition:fade={{ duration: 200 }}>
            <ion-title>This is a test {activeIndex}</ion-title>
            <img src={images[activeIndex]} alt=""/>
            <button>GO next</button>
        </div>
    {/key}
</ion-content>

<style>
    swiper-container {
        width: 100%;
    }
</style>