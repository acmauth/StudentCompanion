import { LocalNotifications } from '@capacitor/local-notifications';
import launchNativenotificationSettings from '$lib/functions/nativeSettings/launchNotificationSettings';
import { get } from 'svelte/store';
import { t, getLocale} from "$lib/i18n";


/**
 * Function to check if the app has permission to post exact alerts
 * @returns A Promise<boolean> indicating if the permission is granted
 */
async function checkExactAlarmPermision(): Promise<boolean> {
    const exactAlarm = await LocalNotifications.checkExactNotificationSetting();
    
    if (exactAlarm.exact_alarm !== 'granted') {
        console.log('Exact alarm permission is not granted.');
        return false;
    }
    
    return true;
}

/**
 * Function to request the SCHEDULE_EXACT_ALARM permission
 * @returns A Promise<boolean> indicating if the permission was granted after the request
 */
async function requestExactAlarmPermission(){
    const userConfirmed = confirm('Exact alarms are disabled. Notifications may not be precise. Would you like to enable exact alarms in the system settings?');

    if (userConfirmed){
      const changeStatus = await LocalNotifications.changeExactNotificationSetting();
      
      if (changeStatus.exact_alarm === 'granted'){
        return true;
      }
    }
    return false;
}
/**
 * Function to check if the app has permission to post notifications
 * @returns A Promise<boolean> indicating if the permission is granted
 */
async function checkNotificationPermission(): Promise<boolean> {
    const permissionStatus = await LocalNotifications.checkPermissions();

    if (permissionStatus.display === 'granted') {
        return true;
    } else {
        return  false;
    }
}

/**
 * Function to request the POST_NOTIFICATIONS permission
 * @returns A Promise<boolean> indicating if the permission was granted after the request
 */
async function requestNotificationPermission(): Promise<boolean> {
  const permissionRequest = await LocalNotifications.requestPermissions();

  if (permissionRequest.display === 'granted') {
    return true;
  } else {
    return false;
  }
}

export async function handleNotificationPermission() {
  const hasPermission = await checkNotificationPermission();
  
  if (!hasPermission) {
    const permissionGranted = await requestNotificationPermission();
    
    if (permissionGranted) {
      console.log('Notification permission granted!');
      return true;
    } else {
      console.log('Notification permission denied.');
      // Prompt user to go to settings
      const userConfirmed = confirm(get(t)("event.notification.permissionConfirmation"));
      
      if (userConfirmed) {
        launchNativenotificationSettings();
      }
      return false;
    }
  } else {
    console.log('Already has notification permission.');
    return true;
  }
}


export async function handleExactAlarmPermission(){
  const hasPermission = await checkExactAlarmPermision();

  if (!hasPermission){
    const permissionGranted = await requestExactAlarmPermission();

    if (permissionGranted){
      console.log('Exact Alert permission granted');
      return true;
    }
    return false;
  } else {
    console.log('Already has notification permission.');
    return true;
  }
}