import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

export default function LaunchNativeNotificationSettings()  {
    if (Capacitor.isNativePlatform()){
        NativeSettings.open({
            optionAndroid: AndroidSettings.AppNotification, 
            optionIOS: IOSSettings.App
          });
    }
}