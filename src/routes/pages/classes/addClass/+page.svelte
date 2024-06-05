<script lang="ts">
    import { goto } from '$app/navigation';
    import { weekdays, getDay } from '$components/schedule/day/days';
    import { classStore } from '$components/schedule/class/classStore';
	import type { ClassItem, TimeSlot } from '$components/schedule/class/ClassItem';
    import { add } from 'ionicons/icons';
	import { onMount } from 'svelte';
    import { toastController } from '@ionic/core';
    import GenericHeader from "$components/shared/subPageHeader.svelte";
    import { t, locale} from '$lib/translations';

    let l = $locale;

    let selectedOption: boolean[];
    let count: number;

    onMount(() => { count = 1; selectedOption = []});
   

    function clearSelection(i: number) {
        const selection = (document.getElementById("day-" + i.toString()) as HTMLIonSelectElement);
        selection.value = null;
        selectedOption[i] = false;
        if (count > 1) count--;
    }

    function onCancel() {
        goto('/pages/schedule');
    }
    
    async function onSubmit(event: Event) {
        event.preventDefault();

        const title = (document.getElementById('title') as HTMLInputElement).value || $t("schedule.lesson_unknown");
        const classroom = (document.getElementById('classroom') as HTMLInputElement).value || $t("schedule.classroom_unknown");
        const professor = (document.getElementById('professor') as HTMLInputElement).value || $t("schedule.professor_unknown");
        const slots: TimeSlot[] = [];
        for (let i = 0; i < count; i++) {
            if (!selectedOption[i]) continue;
            const day = (document.getElementById(`day-${i}`) as HTMLIonSelectElement).value;
            const startInputElement = document.getElementById(`start-${i}`) as HTMLIonDatetimeElement;
            const endInputElement = document.getElementById(`end-${i}`) as HTMLIonDatetimeElement;
            const start = new Date(startInputElement.value?.toString() || new Date().toString());
            const end = new Date(endInputElement.value?.toString() || new Date().toString());

            if (start >= end) {
                await toastController.create({message: $t("schedule.lesson_time_error"), duration: 2000, color: 'tertiary' , mode: 'ios', translucent: true, cssClass: 'toast-center'})
                        .then(toast => toast.present());
                return;
            } else slots.push({ day:day, startTime: start, endTime:end });
        }

        let formData: ClassItem = {
            id: new Date().getTime(),
            title,
            classroom,
            professor,
            slots
        };

        $classStore = $classStore.concat(formData);
        
        goto('/pages/schedule');
    }

</script>


<GenericHeader title = {$t("schedule.add_lesson_title")} genericHeader />

<ion-content fullscreen class="ion-padding flex flex-col justify-center space-y-4 p-8">
    <form on:submit={onSubmit}>
        <ion-input			
            placeholder = {$t("schedule.lesson_title")}
            label = {$t("schedule.lesson_title_placeholder")}
            label-placement = "stacked"
            id = "title"
            type = "text"
            contenteditable = "true"
            spellcheck = {true}
        />                    

        <ion-input			
            placeholder = {$t("schedule.lesson_label_placeholder")}
            label = {$t("schedule.lesson_label")}
            label-placement = "stacked"
            id = "classroom"
            type = "text"
            contenteditable = "true"
            spellcheck = {true}
        />
        
        <ion-input			
            placeholder = {$t("schedule.lesson_teacher_placeholder")}
            label = {$t("schedule.lesson_teacher")}
            label-placement = "stacked"
            id = "professor"
            type = "text"
            contenteditable = "true"
            spellcheck = {false}
        />   

        {#each {length: count} as _, i}
            <ion-div style="display: flex; align-items: center; justify-content: center; width: 100%; padding-bottom: 0">
                <ion-select
                    id="day-{i}"
                    label-placement="stacked" 
                    interface="action-sheet"
                    cancel-text= {$t("schedule.cancel_l")}
                    style="padding:0; margin-right: 20px;"
                    placeholder= {$t("schedule.day")}
                    on:ionChange={() => {selectedOption[i] = true;}}
                    on:ionCancel={() => {selectedOption[i] = false; clearSelection(i);}}>
                    {#each weekdays as day, j}
                        {#each Object.keys(day) as key }
                            <ion-select-option id={key} contextmenu="" value="{j}">{getDay(j, l)}</ion-select-option>
                        {/each}
                    {/each}
                </ion-select>

                <ion-datetime-button datetime="start-{i}" disabled={!selectedOption[i]}></ion-datetime-button>
                <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="start-{i}" presentation="time" minute-values="0,15,30,45" hour-cycle="h23" value="2024-01-01T09:15"></ion-datetime>
                </ion-modal>

                <ion-datetime-button datetime="end-{i}" disabled={!selectedOption[i]}></ion-datetime-button>
                <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="end-{i}"  presentation="time" minute-values="0,15,30,45" hour-cycle="h23" value="2024-01-01T10:00"></ion-datetime>
                </ion-modal>
                
            </ion-div>
        {/each}
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <ion-div on:click={() => {$: count++;}} style="display: flex; align-items: left; justify-content: left; width: 100%; padding-top: 15px; padding-bottom: 10px">
            <ion-icon icon={add} style="margin-right: 5px;"></ion-icon>
            <ion-div>{$t("schedule.add_day")}</ion-div>
        </ion-div>  

        <div style="display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type="reset" on:ionFocus={onCancel} color="light">{$t("schedule.cancel_u")}</ion-button>
            <ion-button type="submit">{$t("schedule.add")}</ion-button>  
        </div>
    </form>
</ion-content>
