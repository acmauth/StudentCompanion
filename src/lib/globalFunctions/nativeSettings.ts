import { App as capacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

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
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        StatusBar.setStyle({style: Style.Dark});
    }
    else {
        StatusBar.setStyle({style: Style.Light});
    }

    if (Capacitor.getPlatform() === 'android') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            StatusBar.setBackgroundColor({color: '#0e0e11'});
        }
        else {
            StatusBar.setBackgroundColor({color: '#FCFCFC'});
        }
    }
}