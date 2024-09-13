import { LocalNotifications } from '@capacitor/local-notifications';
import launchNativenotificationSettings from '$lib/functions/nativeSettings/launchNotificationSettings';

/**
 * Function to check if the app has permission to post notifications
 * @returns A Promise<boolean> indicating if the permission is granted
 */
export async function checkNotificationPermission(): Promise<boolean> {
  const permissionStatus = await LocalNotifications.checkPermissions();

  if (permissionStatus.display === 'granted') {
    return true;
  } else if (permissionStatus.display === 'denied') {
    return  false;
  } else {
    // Handle case for unknown or undetermined status
    return false;
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
      const userConfirmed = confirm('Notification permission is denied. Would you like to open settings to enable it?');
      
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
