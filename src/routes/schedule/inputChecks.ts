import { goto } from '$app/navigation';

export function handleTimeChange(event: CustomEvent<KeyboardEvent>) {
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

export let count = 1;

export function handleDaySelection(event: CustomEvent<KeyboardEvent>) {
    if (event.target.value != null && event.target.value != "")
        count++;
}

export function clearDaySelection(event: CustomEvent<KeyboardEvent>) {
    if (!(count > 1 && event.target.value == ""))
        count--;
    event.target.value = "";
}

export function onCancel() {
    goto('/schedule');
}