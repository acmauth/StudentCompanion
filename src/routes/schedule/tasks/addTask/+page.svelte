<script lang="ts">
    import type { TaskItem } from "$lib/components/schedule/task/TaskItem";
    import { goto } from '$app/navigation';
	import { taskStore } from "$components/schedule/task/TaskStore";


    function onCancel() {
        goto('/schedule/tasks');
    }

    function onSubmit() {
        let formData: TaskItem = {
            id: new Date().getTime(),
            title: (document.getElementById("title") as HTMLInputElement)?.value || "New task",
            description: (document.getElementById("description") as HTMLInputElement)?.value || "Wizard stuff",
            slot: {
                day: new Date().getDay(),
                timeStart: String(new Date((document.getElementById("starttime") as HTMLInputElement)!. value).getHours()) || "00:00",
                timeEnd: String(new Date((document.getElementById("endtime") as HTMLInputElement)!. value).getHours()) || "00:00",
            }
        };

        $taskStore = $taskStore.concat(formData);
        goto('/schedule/tasks');
    }
</script>

<ion-header>
    <ion-toolbar>
        <ion-title>Νέα εργασία</ion-title>
    </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding flex flex-col justify-center space-y-4 p-8">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <form on:submit|preventDefault={onSubmit}>
        <ion-input			
            placeholder="Broomstick flying"
            label="Title"
            label-placement="stacked"
            id="title"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />                    

        <ion-input			
            placeholder="Become a witch or wizard."
            label="Description"
            label-placement="stacked"
            id="description"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />     

        <ion-row>
            <ion-col>
                <ion-input label="From" 
                            label-placement="stacked" 
                            type="datetime-local"
                            id="starttime" 
                            name="starttime" 
                            value="09:00" 
                />
            </ion-col>
            <ion-col>
                <ion-input label="To" 
                            label-placement="stacked" 
                            type="datetime-local" 
                            id="endtime" 
                            name="endtime" 
                            value="10:00" 
                />
            </ion-col>
        </ion-row>

            
        <div style="display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type="reset" on:ionFocus={onCancel}>Cancel</ion-button>
            <ion-button type="button" on:ionFocus={onSubmit}>Create</ion-button>
        </div>
    </form>
</ion-content>
