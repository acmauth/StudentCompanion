import { App as capacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';

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
    if (document.body.classList.contains('dark')) {
        StatusBar.setStyle({style: Style.Dark});
        NavigationBar.setColor({ color: '#1F1F1F', darkButtons: false });
    }
    else {
        StatusBar.setStyle({style: Style.Light});
        NavigationBar.setColor({ color: '#FCFCFC', darkButtons: true });
    }


    if (Capacitor.getPlatform() === 'android') {
        if (document.body.classList.contains('dark')) {
            StatusBar.setBackgroundColor({color: '#111111'});
        }
        else {
            StatusBar.setBackgroundColor({color: '#FCFCFC'});
        }
    }
}
