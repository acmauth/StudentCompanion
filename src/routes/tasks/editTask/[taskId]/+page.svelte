<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { taskStore } from '$components/schedule/task/taskStore';
    import { TaskType } from '$components/schedule/task/TaskItem';
    import type { TaskItem } from '$components/schedule/task/TaskItem';
	import { toastController } from '@ionic/core';

    // Extract taskId from the URL and get the referenced task
	const taskId = $page.params.taskId;
    let taskItem = $taskStore.find(x => x.id === Number(taskId));
    
    if (taskItem == undefined) {
        alert("Το συμβάν δεν βρέθηκε.");
        goto('/schedule/tasks');
    }

    let startDate = new Date(taskItem?.date.startDate || new Date());
    let start =  startDate.getFullYear() + "-" + 
                (String(startDate.getMonth() + 1)).padStart(2, '0') + "-" + 
                String(startDate.getDate()).padStart(2, '0') + "T" + 
                String(startDate.getHours()).padStart(2, '0') + ":" + 
                String(startDate.getMinutes()).padStart(2, '0');

    let endDate = new Date(taskItem?.date.endDate || new Date());
    let end =  endDate.getFullYear() + "-" + 
            (String(endDate.getMonth() + 1)).padStart(2, '0') + "-" + 
            String(endDate.getDate()).padStart(2, '0') + "T" + 
            String(endDate.getHours()).padStart(2, '0') + ":" + 
            String(endDate.getMinutes()).padStart(2, '0');


    function onCancel() {
        goto('/tasks');
    }

    function onDelete() {
        taskStore.update(oldArray => {
            // Filter out the item with the specified id
            const newArray = oldArray.filter(item => item.id !== taskItem?.id);
            return newArray;
        });
        goto('/tasks');
    }

    async function onSubmit() {
        const startInputElement = document.getElementById("start") as HTMLIonDatetimeElement;
        const endInputElement = document.getElementById("end") as HTMLIonDatetimeElement;
        const startDate = new Date(startInputElement.value?.toString() || new Date().toString());
        const endDate = new Date(endInputElement.value?.toString() || new Date().toString());

        if (startDate > endDate) {
            await toastController.create({message: "Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης.", duration: 2000, color: 'tertiary' , mode: 'ios', translucent: true, cssClass: 'toast-center'})
                        .then(toast => toast.present());
            return;
        }

        let formData: TaskItem = {
            id: taskItem?.id || new Date().getTime(),
            title: (document.getElementById("title") as HTMLInputElement)?.value || "Ανώνυμο συμβάν",
            description: (document.getElementById("description") as HTMLInputElement)?.value || "Χωρίς περιγραφή",
            date: {
                startDate: startDate,
                endDate: endDate
            },
            type: ((document.getElementById("type") as HTMLIonRadioGroupElement)?.value as TaskType) || TaskType.OTHER
        };

        if (formData == taskItem) {
            goto('/tasks');
            return;
        }

        taskStore.update(oldArray => {
            // Find the index of the item with the specified id
            const index = oldArray.findIndex(item => item.id === taskItem?.id);

            // If the item is found, update its value
            if (index !== -1) {
                oldArray[index] = formData;
            }
            return [...oldArray];
        });

        goto('/tasks');
    }
</script>

<ion-header>
    <ion-toolbar>
        <ion-title>Επεξεργασία {taskItem?.type == TaskType.PROJECT ? 'εργασίας' : taskItem?.type == TaskType.TEST ? 'προόδου' : 'συμβάντος'}</ion-title>
    </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding flex flex-col justify-center space-y-4 p-8">
    <form on:submit={onSubmit}>
        <ion-input			
            placeholder="Πρόοδος στην ιπτάμενη σκούπα"
            label="Τίτλος"
            label-placement="stacked"
            id="title"
            value={taskItem?.title}
            type="text"
            contenteditable="true"
            spellcheck={true}
        />                    

        <ion-input			
            placeholder="Στροφές με τη σκούπα μου"
            label="Περιγραφή"
            label-placement="stacked"
            id="description"
            value={taskItem?.description}
            type="text"
            contenteditable="true"
            spellcheck={true}
        />     

        <ion-div style="display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 2%; margin-bottom: 3%;">
            <ion-label style="flex: 1;">Από</ion-label>
            <ion-datetime-button datetime="start"></ion-datetime-button>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="start" locale="el-GR" value={start}></ion-datetime>
            </ion-modal>
        </ion-div>
        
        <ion-div style="display: flex; align-items: center; justify-content: center; width: 100%;">
            <ion-label style="flex: 1;">Έως</ion-label>
            <ion-datetime-button datetime="end"/>
            <ion-modal keep-contents-mounted={true}>
                <ion-datetime id="end" locale="el-GR" value={end}></ion-datetime>
            </ion-modal>
        </ion-div>
        
        
        <ion-row class="expanded-row">
            <ion-radio-group id="type" value={taskItem?.type.valueOf()} class="expanded-radio-group">
                <ion-radio mode="ios" slot="end" value="test">Πρόοδος</ion-radio>
                <ion-radio mode="ios" slot="end" value="project">Εργασία</ion-radio>
                <ion-radio mode="ios" slot="end" value="other">Άλλο</ion-radio>
            </ion-radio-group>
        </ion-row>
        
        <div style="display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type="reset" color="light" on:ionFocus={onCancel}>ΑΚΥΡΟ</ion-button>
            <ion-button type="button" color="secondary" on:ionFocus={onDelete}>ΔΙΑΓΡΑΦΗ</ion-button>
            <ion-button type="submit" on:ionFocus={onSubmit}>ΕΝΗΜΕΡΩΣΗ</ion-button>
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