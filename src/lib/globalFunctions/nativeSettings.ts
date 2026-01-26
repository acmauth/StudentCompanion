import { App as capacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { navController } from '$components/shared/StackedNav';
// import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SafeArea } from 'capacitor-plugin-safe-area';

export async function nativeSettings() {
    /* Capacitor back button handling */
    capacitorApp.addListener('backButton', ({canGoBack}) => {
        if(!canGoBack){
            capacitorApp.exitApp();
        } else {
            if (navController.canGoBack()){
                navController.pop();
            } else {
                window.history.back();
            }
        }
    });
    StatusBar.setOverlaysWebView({ overlay: true });
    SafeArea.getSafeAreaInsets().then((data) => {
    const { insets } = data;
    document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
    document.body.style.setProperty('--ion-safe-area-right', `${insets.right}px`);
    document.body.style.setProperty('--ion-safe-area-bottom', `${insets.bottom}px`);
    document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
    });

    

    // Set the background color to match the app's color scheme
    if (document.body.classList.contains('dark')) {
        await StatusBar.setStyle({ style: Style.Dark });
    }
    else {
        await StatusBar.setStyle({ style: Style.Light });
    }

}

// const enableEdgeToEdge = async () => {
//   await EdgeToEdge.enable();
//   await StatusBar.show();
//   await StatusBar.setOverlaysWebView({ overlay: true });
// };

// const disable = async () => {
//   await EdgeToEdge.disable();
// };

// const getInsets = async () => {
//   const result = await EdgeToEdge.getInsets();
//   console.log('Insets:', result);
// };

// const setBackgroundColorLight = async () => {
//   await EdgeToEdge.setBackgroundColor({ color: '#ffffff' });
//   await StatusBar.setStyle({ style: Style.Light });
//   await StatusBar.setBackgroundColor({ color: '#ffffff' });
// };
// const setBackgroundColorDark = async () => {
//   await EdgeToEdge.setBackgroundColor({ color: '#1f1f1f' });
//   await StatusBar.setStyle({ style: Style.Dark });
//   await StatusBar.setBackgroundColor({ color: '#121212' });
// };

// export const EdgeToEdgeFunctions = {
//   enableEdgeToEdge,
//   disable,
//   getInsets,
//   setBackgroundColorLight,
//   setBackgroundColorDark
// };