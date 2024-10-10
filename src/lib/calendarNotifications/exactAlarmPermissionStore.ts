import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore';
import { get } from "svelte/store";
import { checkExactAlarmPermission } from './runtimePermissions';
import { getIds } from './notificationsStore';
import { scheduleNotification } from './scheduleNotifications';
import { removePastNotifications } from './repeatedNotifications';

// stores a boolean that shows if the exact alarm permission was enabled or not the previous session
const exactAlarmPermission = new CapacitorPersistedStore<boolean>(true, 'previousExactAlarm');

// changes the value of the store
function updateExactAlarmsStore(permission: boolean){
    get(exactAlarmPermission);
    exactAlarmPermission.update(storedPermission => permission);
}

// returns the value of the store
function previousExactAlarmPermission():boolean{
    let previousPermission:boolean = false; // initializing to remove the warning
    exactAlarmPermission.subscribe(storedPermission => {
        previousPermission = storedPermission; 
    });
    return previousPermission;
}

// checks if the exact alarm permission has changed from the previous session
async function permissionIsTheSame():Promise<boolean>{
    const currentPermission = await checkExactAlarmPermission();
    const previousPermission = previousExactAlarmPermission();
    return currentPermission == previousPermission;
}

// reschedules every notification if the exact alarms permission has changed
export async function handleChangedPermission(){
    if (!(await permissionIsTheSame())){    
        removePastNotifications();
        const storedIds = getIds();
        for (const storedId of storedIds){
            scheduleNotification(storedId.event); // rescheduling the notification/-s
        }
        updateExactAlarmsStore(!previousExactAlarmPermission());
    }
}