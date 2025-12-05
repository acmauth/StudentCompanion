import { App as capacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { navController } from '$components/shared/StackedNav';
// import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';

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

    

    // Set the background color to match the app's color scheme
    if (document.body.classList.contains('dark')) {
        await setBackgroundColorDark();
    }
    else {
        await setBackgroundColorLight();
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