<script lang="ts">
    import type { TaskItem } from "$lib/components/schedule/subject/TaskItem";
    import { taskStore } from '$lib/components/schedule/subject/taskStore';
    import { weekdays } from '$lib/components/schedule/day/days'
    import { goto } from '$app/navigation';

    let modalOpen = false;

    let formData: TaskItem = {
        id: Math.floor(Math.random()*100000),
        title: "New subject",
        professor: "Mr Know-it-all",
        classroom: "Campus",
        dateTime: [new Date()],
    };

    function onSubmit() {
        formData.title = (document.getElementById("title") as HTMLInputElement)?.value || "New Subject";
        formData.professor = (document.getElementById("proffesor") as HTMLInputElement)?.value || "Mr Know-it-all";
        formData.classroom = (document.getElementById("classroom") as HTMLInputElement)?.value || "Campus";

        $taskStore = [formData, ...$taskStore];
        goto('/schedule');
    }

    interface DayTime {
        [key: string]: string;
    }

    let dayAndTimes :DayTime[] = []; 
    let currentDay = '';
    let currentTime = '';

    const addDayAndTime = () => {
    if (currentDay && currentTime) {
        dayAndTimes = [...dayAndTimes, { day: currentDay, time: currentTime }];
        currentDay = '';
        currentTime = '';
        }
    };
</script>

<ion-header>
    <ion-toolbar>
        <ion-title>Create a lecture</ion-title>
    </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding flex flex-col justify-center space-y-4 p-8">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <form on:submit|preventDefault={onSubmit}>

        <ion-input			
            placeholder="Coolness 101"
            label="Title"
            label-placement="stacked"
            id="title"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />                    

        <ion-input			
            placeholder="Hogwarts campus"
            label="Classroom"
            label-placement="stacked"
            id="classroom"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />         

        <ion-input			
            placeholder="Mr Know-it-all"
            label="Professor"
            label-placement="stacked"
            id="proffesor"
            type="text"
            contenteditable="true"
            spellcheck={false}
        />         

        <ion-list>
            <ion-row>
                <ion-col style="padding-top: 0;">
                    <ion-select label="Day" label-placement="stacked" interface="action-sheet" placeholder="Select day" style="padding:0;">
                        {#each weekdays as day}
                            {#each Object.keys(day) as key }
                                <ion-select-option contextmenu="" >{day[key].en}</ion-select-option>
                            {/each}
                        {/each}
                    </ion-select>
                </ion-col>
                <ion-row>
                    <ion-col>
                        <ion-input label="From" label-placement="stacked" type="time" id="starttime" name="starttime" value="09:00"/>
                    </ion-col>
                    <ion-col>
                        <ion-input label="To" label-placement="stacked" type="time" id="endtime" name="endttime" value="10:00" >
                    </ion-col>
                </ion-row>
            </ion-row>
        </ion-list>
          
        <!-- <ion-row class="ion-align-items-center">
            <ion-col size="3">
                <ion-label>Day:</ion-label>
            </ion-col>
            <ion-col size="9">
                <ion-select placeholder="Select day">
                    {#each weekdays as day}
                        {#each Object.keys(day) as key }
                            <ion-select-option value={key.charAt(0).toUpperCase() + key.slice(1)}>{key.charAt(0).toUpperCase() + key.slice(1)}</ion-select-option>
                        {/each}
                    {/each}
                </ion-select>
            </ion-col>
        </ion-row> -->

        <!-- Add more rows for additional fields if needed -->

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- <ion-button expand="full" on:click={addDayAndTime}>Add Day and Time</ion-button> -->

        <!-- {#if dayAndTimes.length > 0}
            <ion-row class="ion-align-items-center">
                <ion-col size="3">
                    <ion-label>Day:</ion-label>
                </ion-col>
                <ion-col size="9">
                    <select placeholder="Select day" bind:value={currentDay}>
                        {#each weekdays as day}
                            {#each Object.keys(day) as key }
                                <ion-select-option value={key.charAt(0).toUpperCase() + key.slice(1)}>{key.charAt(0).toUpperCase() + key.slice(1)}</ion-select-option>
                            {/each}
                        {/each}
                    </select>
                </ion-col>
            </ion-row>

            <ion-row class="ion-align-items-center">
                <ion-col size="3">
                    <ion-label>Time:</ion-label>
                </ion-col>
                <ion-col size="9">
                    <ion-datetime displayFormat="h:mm A" pickerFormat="h mm A" />
                </ion-col>
            </ion-row>
        {/if} -->

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- <ion-button expand="full" type="submit" on:click={onSubmit}>Create</ion-button> -->
    </form>
</ion-content>

<style>
  
    /* Optional: Adjust styling for better alignment */
    ion-item {
        margin-right: 16px; /* Add margin for spacing */
    }
  
    input {
        align-self: center;
        height: 100%;
        border: none; /* Remove the border */
        outline: none; /* Remove the outline on focus (optional) */
    }
  
    ion-input[type="time"]::-webkit-picker-indicator {
                display: none;
    }
</style>