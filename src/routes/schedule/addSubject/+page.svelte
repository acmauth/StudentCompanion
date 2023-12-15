<script lang="ts">
    import type { SubjectItem, TimeSlot } from "$lib/components/schedule/subject/SubjectItem";
    import { subjectStore } from '$lib/components/schedule/subject/SubjectStore';
    import { weekdays } from '$lib/components/schedule/day/days'
    import { goto } from '$app/navigation';

    function handleTimeChange(event: CustomEvent<KeyboardEvent>) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const name = target.name;
        const id = target.id.split("-")[1];
        if (name === "starttime") {
            if (value == "") {
                target.value = "00:00";
                var endTime = document.querySelector("#endtime-" + id) as HTMLInputElement;
                endTime.value = "01:00";
            } else {
                const nextHours = String(parseInt(value.split(":")[0]) < 23 ? parseInt(value.split(":")[0]) + 1 : 0);
                const nextMins = String(parseInt(value.split(":")[1]) < 59 ? parseInt(value.split(":")[1]) : 0);
                var nextTime = nextHours.length < 2 ? "0" + nextHours : nextHours;
                nextTime += ":" + (nextMins.length < 2 ? "0" + nextMins : nextMins);
                var endTime = document.querySelector("#endtime-" + id) as HTMLInputElement;
                endTime.value = nextTime;
            }
        } else if (name === "endtime") {
            if (value == "" || document.querySelector("#starttime-" + id)?.value > value) {
                const nextHours = String(parseInt(document.querySelector("#starttime-" + id)?.value.split(":")[0]) < 23 ? parseInt(document.querySelector("#starttime-" + id)?.value.split(":")[0]) + 1 : 0);
                const nextMins = String(parseInt(document.querySelector("#starttime-" + id)?.value.split(":")[1]) < 59 ? parseInt(document.querySelector("#starttime-" + id)?.value.split(":")[1]) : 0);
                var nextTime = nextHours.length < 2 ? "0" + nextHours : nextHours;
                nextTime += ":" + (nextMins.length < 2 ? "0" + nextMins : nextMins);
                target.value = nextTime;
            }
        }
    }

    let count = 1;

    function handleDaySelection(event: CustomEvent<KeyboardEvent>) {
        if (event.target.value != null && event.target.value != "")
            count++;
    }

    function clearDaySelection(event: CustomEvent<KeyboardEvent>) {
        if (!(count > 1 && event.target.value == ""))
            count--;
        event.target.value = "";
    }

    function onCancel() {
        goto('/schedule');
    }

    function onSubmit() {
        let formData: SubjectItem = {
            id: new Date().getTime(),
            title: (document.getElementById("title") as HTMLInputElement)?.value || "New Subject",
            professor: (document.getElementById("professor") as HTMLInputElement)?.value || "Mr Know-it-all",
            classroom: (document.getElementById("classroom") as HTMLInputElement)?.value || "Campus",
            slots: new Array<TimeSlot>()
        };

        const days = document.querySelectorAll("ion-select");
        if (days.length > 1) {
            for (let i = 0; i < days.length - 1 ; i++) {
                const day = days[i] as HTMLIonSelectElement;
                if (day.value != null && day.value != "") {
                    const startTime = (document.getElementById("starttime-" + i) as HTMLInputElement)?.value || "00:00";
                    const endTime = (document.getElementById("endtime-" + i) as HTMLInputElement)?.value || "01:00";
                    formData.slots.push({
                        day: day.value,
                        timeStart: startTime,
                        timeEnd: endTime
                    });
                }
            }

            $subjectStore = $subjectStore.concat(formData);
        }

        goto('/schedule');
    }
</script>

<ion-header>
    <ion-toolbar>
        <ion-title>Create a new task</ion-title>
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
            id="professor"
            type="text"
            contenteditable="true"
            spellcheck={false}
        />         


        {#each {length: count} as _, i}
            <ion-row>
                <ion-col style="padding-left: 0%; padding-top: 0%">
                    <ion-select label="Day" 
                                label-placement="stacked" 
                                interface="action-sheet" 
                                on:ionCancel={clearDaySelection} 
                                placeholder="Select day" 
                                on:ionChange={handleDaySelection} 
                                style="padding:0;">
                        {#each weekdays as day}
                            {#each Object.keys(day) as key }
                                <ion-select-option id={key} contextmenu="">{day[key].en}</ion-select-option>
                            {/each}
                        {/each}
                    </ion-select>
                </ion-col>
                <ion-row>
                    <ion-col>
                        <ion-input label="From" 
                                    label-placement="stacked" 
                                    type="time" 
                                    id="starttime-{i}" 
                                    name="starttime" 
                                    value="09:00" 
                                    on:ionInput={handleTimeChange}
                                    disabled={!(i + 1 < count)}/>
                    </ion-col>
                    <ion-col>
                        <ion-input label="To" 
                                    label-placement="stacked" 
                                    type="time" 
                                    id="endtime-{i}" 
                                    name="endtime" 
                                    value="10:00" 
                                    on:ionInput={handleTimeChange}
                                    disabled={!(i + 1 < count)}/>
                    </ion-col>
                </ion-row>
            </ion-row>
        {/each}
            
        <div style="display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type="reset" on:ionFocus={onCancel}>Cancel</ion-button>
            <ion-button type="button" on:ionFocus={onSubmit}>Create</ion-button>
        </div>
    </form>
</ion-content>
