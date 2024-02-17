<script lang="ts">
    import { goto } from '$app/navigation';
    import { weekdays } from '$components/schedule/day/days';
    import { classStore } from '$components/schedule/class/classStore';
	import type { ClassItem, TimeSlot } from '$components/schedule/class/ClassItem';

    let count = 1;

    function handleDaySelection() {
        count++;
    }

    function handleDayCancel() {
        count > 1 ? count-- : count = 1;
    }

    function onCancel() {
        goto('/schedule/classes');
    }
    
    function onSubmit() {
        const title = (document.getElementById('title') as HTMLInputElement).value || "Ανώνυμο μάθημα";
        const classroom = (document.getElementById('classroom') as HTMLInputElement).value || "Χωρίς αίθουσα";
        const professor = (document.getElementById('professor') as HTMLInputElement).value || "Χωρίς διδάσκοντα";
        const slots: TimeSlot[] = [];
        for (let i = 0; i < count - 1; i++) {
            const day = (document.getElementById(`day-${i}`) as HTMLIonSelectElement).value;
            const startInputElement = document.getElementById(`start-${i}`) as HTMLIonDatetimeElement;
            const endInputElement = document.getElementById(`end-${i}`) as HTMLIonDatetimeElement;
            const start = new Date(startInputElement.value?.toString() || new Date().toString());
            const end = new Date(endInputElement.value?.toString() || new Date().toString());

            if (start >= end) {
                alert("Η ημερομηνία λήξης πρέπει να είναι μετά την ημερομηνία έναρξης");
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
        
        goto('/schedule/classes');
    }

</script>

<ion-header>
    <ion-toolbar>
        <ion-title>Νέο μάθημα</ion-title>
    </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding flex flex-col justify-center space-y-4 p-8">
    <form on:submit={onSubmit}>
        <ion-input			
            placeholder="Τελειότητα 101"
            label="Τίτλος"
            label-placement="stacked"
            id="title"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />                    

        <ion-input			
            placeholder="Hogwarts campus"
            label="Αίθουσα"
            label-placement="stacked"
            id="classroom"
            type="text"
            contenteditable="true"
            spellcheck={true}
        />
        
        <ion-input			
            placeholder="Κύριος Ξερώλας"
            label="Διδάσκων"
            label-placement="stacked"
            id="professor"
            type="text"
            contenteditable="true"
            spellcheck={false}
        />   

        {#each {length: count} as _, i}
            <ion-div style="display: flex; align-items: center; justify-content: center; width: 100%; padding-bottom: 0">
                <ion-select
                    id="day-{i}"
                    label-placement="stacked" 
                    interface="action-sheet"
                    on:ionChange={handleDaySelection} 
                    on:ionCancel={handleDayCancel}
                    cancel-text="Άκυρο"
                    style="padding:0; margin-right: 20px;"
                    placeholder="Ημέρα">
                    {#each weekdays as day, j}
                        {#each Object.keys(day) as key }
                            <ion-select-option id={key} contextmenu="" value="{j}">{day[key].el}</ion-select-option>
                        {/each}
                    {/each}
                </ion-select>

                <ion-datetime-button datetime="start-{i}" disabled={i == count - 1 && count > 1}></ion-datetime-button>
                <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="start-{i}" presentation="time" minute-values="0,15,30,45" hour-cycle="h23"></ion-datetime>
                </ion-modal>

                <ion-datetime-button datetime="end-{i}" disabled={i == count - 1 && count > 1}></ion-datetime-button>
                <ion-modal keep-contents-mounted={true}>
                    <ion-datetime id="end-{i}"  presentation="time" minute-values="0,15,30,45" hour-cycle="h23"></ion-datetime>
                </ion-modal>
            </ion-div>
        {/each}
        
        <div style="display: flex; justify-content: space-between; padding-top: 5%">
            <ion-button type="reset" on:ionFocus={onCancel} color="light">ΑΚΥΡΟ</ion-button>
            <ion-button type="submit">ΠΡΟΣΘΗΚΗ</ion-button>  
        </div>
    </form>
</ion-content>
