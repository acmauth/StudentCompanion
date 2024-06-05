<script lang="ts">
    import { TaskType, type TaskItem } from "$lib/components/schedule/task/TaskItem";
    import { goto } from '$app/navigation';
	import { taskStore } from "$components/schedule/task/taskStore";
	import { toastController } from "@ionic/core";
    import GenericHeader from "$components/shared/subPageHeader.svelte";
    import { t, locale} from '$lib/translations';

    let l = $locale;

    function onCancel() {
        goto('/pages/tasks');
    }

    async function onSubmit(event: Event) {
        event.preventDefault();

        const startInputElement = document.getElementById("start") as HTMLIonDatetimeElement;
        const endInputElement = document.getElementById("end") as HTMLIonDatetimeElement;
        const startDate = new Date(startInputElement.value?.toString() || new Date().toString());
        const endDate = new Date(endInputElement.value?.toString() || new Date().toString());

        if (startDate > endDate) {
            await toastController.create({message: $t("tasks.time_error"), duration: 2000, color: 'tertiary' , mode: 'ios', translucent: true, cssClass: 'toast-center'})
                        .then(toast => toast.present());
                return;
        }

        let formData: TaskItem = {
            id: new Date().getTime(),
            title: (document.getElementById("title") as HTMLInputElement)?.value || $t("tasks.unknown_event"),
            description: (document.getElementById("description") as HTMLInputElement)?.value || $t("tasks.unknonw_description"),
            date: {
                startDate: startDate,
                endDate: endDate
            },
            type: ((document.getElementById("type") as HTMLIonRadioGroupElement)?.value as TaskType) || TaskType.OTHER
        };

        $taskStore = $taskStore.concat(formData);
        goto('/pages/tasks');
    }
</script>

<GenericHeader title = {$t("tasks.new_event")} genericHeader />

<ion-content fullscreen class = "ion-padding flex flex-col justify-center space-y-4 p-8">
    <form on:submit={onSubmit}>
        <ion-input			
            placeholder = {$t("tasks.event_label_placeholder")}
            label = {$t("tasks.event_label")}
            label-placement = "stacked"
            id = "title"
            type = "text"
            contenteditable = "true"
            spellcheck = {true}
        />                    

        <ion-input			
            placeholder = {$t("tasks.description_label_placeholder")}
            label = {$t("tasks.description_label")}
            label-placement = "stacked"
            id = "description"
            type = "text"
            contenteditable = "true"
            spellcheck = {true}
        />     

        <ion-div style = "display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 2%; margin-bottom: 3%;">
            <ion-label style="flex: 1;">{$t("tasks.from")}</ion-label>
            <ion-datetime-button datetime="start"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id = "start" locale = { l }></ion-datetime>
            </ion-modal>
        </ion-div>
        
        <ion-div style = "display: flex; align-items: center; justify-content: center; width: 100%;">
            <ion-label style="flex: 1;">{$t("tasks.to")}</ion-label>
            <ion-datetime-button datetime = "end"/>
            <ion-modal keep-contents-mounted = {true}>
                <ion-datetime id = "end" locale = { l }></ion-datetime>
            </ion-modal>
        </ion-div>
        
        
        <ion-row class = "expanded-row">
            <ion-radio-group id = "type" value = "other" class = "expanded-radio-group">
                <ion-radio mode = "ios" slot = "end" value = "test">{$t("tasks.test")}</ion-radio>
                <ion-radio mode = "ios" slot = "end" value =" project">{$t("tasks.project")}</ion-radio>
                <ion-radio mode = "ios" slot = "end" value = "other">{$t("tasks.else")}</ion-radio>
            </ion-radio-group>
        </ion-row>
        
        <div style = "display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type = "reset" on:ionFocus = {onCancel} color = "light">{$t("tasks.cancel")}</ion-button>
            <ion-button type = "submit">{$t("tasks.add")}</ion-button>  
        </div>
    </form>
</ion-content>

<style>
    .expanded-row {
        padding-top: 5%;
        display: flex;
        justify-content: center;
    }

    .expanded-radio-group {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }
</style>