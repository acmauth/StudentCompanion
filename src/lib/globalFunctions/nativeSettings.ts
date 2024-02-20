import { App as capacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';

export function nativeSettings() {
    /* Capacitor back button handling */
    capacitorApp.addListener('backButton', ({canGoBack}) => {
        if(!canGoBack){
            capacitorApp.exitApp();
        } else {
            window.history.back();
        }
    });


    // Set the status bar to match the app's color scheme
    StatusBar.setStyle({style: Style.Light});

    if (Capacitor.getPlatform() === 'android') {
        StatusBar.setBackgroundColor({color: '#FCFCFC'});
        NavigationBar.setNavigationBarColor({color: '#FCFCFC'});
    }
}