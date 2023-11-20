<script lang="ts">
    import type { TaskItem } from "$lib/components/schedule/task/TaskItem";
    import { taskStore } from '$lib/components/schedule/task/taskStore';
    import { weekdays } from '$lib/components/schedule/day/days'
    import { goto } from '$app/navigation';
	import { next } from "cheerio/lib/api/traversing";

    let formData: TaskItem = {
        id: Math.floor(Math.random()*100000),
        title: "New subject",
        professor: "Mr Know-it-all",
        classroom: "Campus",
        dateTime: [new Date()],
    };

    function handleTimeChange(event: CustomEvent<KeyboardEvent>) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const id = target.id;
        if (id === "starttime") {
            if (value == "") {
                target.value = "00:00";
                var endTime = document.querySelector("#endtime") as HTMLInputElement;
                endTime.value = "01:00";
            } else {
                const nextHours = String(parseInt(value.split(":")[0]) < 23 ? parseInt(value.split(":")[0]) + 1 : 0);
                const nextMins = String(parseInt(value.split(":")[1]) < 59 ? parseInt(value.split(":")[1]) : 0);
                var nextTime = nextHours.length < 2 ? "0" + nextHours : nextHours;
                nextTime += ":" + (nextMins.length < 2 ? "0" + nextMins : nextMins);
                var endTime = document.querySelector("#endtime") as HTMLInputElement;
                endTime.value = nextTime;
            }
        } else if (id === "endtime") {
            if (value == "" || document.querySelector("#starttime")?.value > value) {
                const nextHours = String(parseInt(document.querySelector("#starttime")?.value.split(":")[0]) < 23 ? parseInt(document.querySelector("#starttime")?.value.split(":")[0]) + 1 : 0);
                const nextMins = String(parseInt(document.querySelector("#starttime")?.value.split(":")[1]) < 59 ? parseInt(document.querySelector("#starttime")?.value.split(":")[1]) : 0);
                var nextTime = nextHours.length < 2 ? "0" + nextHours : nextHours;
                nextTime += ":" + (nextMins.length < 2 ? "0" + nextMins : nextMins);
                target.value = nextTime;
            }
        }
    }

    function onSubmit() {
        formData.title = (document.getElementById("title") as HTMLInputElement)?.value || "New Subject";
        formData.professor = (document.getElementById("professor") as HTMLInputElement)?.value || "Mr Know-it-all";
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

        <ion-row>
            <ion-col style="padding-left: 0%;">
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
                    <ion-input label="From" label-placement="stacked" type="time" id="starttime" name="starttime" value="09:00" on:ionInput={handleTimeChange}/>
                </ion-col>
                <ion-col>
                    <ion-input label="To" label-placement="stacked" type="time" id="endtime" name="endtime" value="10:00" on:ionInput={handleTimeChange}/>
                </ion-col>
            </ion-row>
        </ion-row>
          
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