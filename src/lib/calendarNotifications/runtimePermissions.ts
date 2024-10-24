import { LocalNotifications } from '@capacitor/local-notifications';
import launchNativenotificationSettings from '$lib/functions/nativeSettings/launchNotificationSettings';
import { get } from 'svelte/store';
import { t, getLocale} from "$lib/i18n";
import { handleChangedPermission } from './exactAlarmPermissionStore';


/**
 * Function to check if the app has permission to post exact alerts
 * @returns A Promise<boolean> indicating if the permission is granted
 */
export async function checkExactAlarmPermission(): Promise<boolean> {
    const exactAlarm = await LocalNotifications.checkExactNotificationSetting();
    
    if (exactAlarm.exact_alarm !== 'granted') {
        return false;
    } 
    return true;
}

/**
 * Function to request the SCHEDULE_EXACT_ALARM permission
 * @returns A Promise<boolean> indicating if the permission was granted after the request
 */
async function requestExactAlarmPermission(){
    const userConfirmed = confirm(get(t)("event.exact_alarm.permissionCOnfirmation"));

    if (userConfirmed){
      const changeStatus = await LocalNotifications.changeExactNotificationSetting();
      
      if (changeStatus.exact_alarm === 'granted'){
        handleChangedPermission();
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

// handles check and request permission, and prompts user to settings
export async function handleNotificationPermission() {
  const hasPermission = await checkNotificationPermission();
  
  if (!hasPermission) {
    const permissionGranted = await requestNotificationPermission();
    
    if (permissionGranted) {
      return true;
    } else {
      // Prompt user to go to settings
      const userConfirmed = confirm(get(t)("event.notification.permissionConfirmation"));
      
      if (userConfirmed) {
        launchNativenotificationSettings();
      }
      return false;
    }
  } else {
    return true;
  }
}

// checks permission, and if disabled prompts user to settings
export async function handleExactAlarmPermission(){
  const hasPermission = await checkExactAlarmPermission();

  if (!hasPermission){
    const permissionGranted = await requestExactAlarmPermission();

    if (permissionGranted){
      return true;
    }
    return false;
  } else {
    return true;
  }
}