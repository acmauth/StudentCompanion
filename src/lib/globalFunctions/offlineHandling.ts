/* Offline support */
import { Network } from '@capacitor/network';
import { toastController } from 'ionic-svelte';
import type { ToastOptions } from '@ionic/core';
import { wifi } from 'ionicons/icons';
import { log } from 'console';

async function showToast(toast: ToastOptions){
    const toast_ = await toastController.create(toast);
    toast_.present();
}

export function addNetworkListener () {
    
    Network.addListener('networkStatusChange', status => {
        console.log('Network status changed', status);
        if (status.connected) {
            showToast({
                color: 'success',
                duration: 1500,
                message: 'Επέστρεψες online!',
                icon: wifi,
                mode: 'ios',
                translucent: true,
                position: 'bottom',
                layout: 'stacked'
            })
        } else {
            showToast({
                color: 'danger',
                duration: 3000,
                message: 'Βρίσκεσαι offline!',
                icon: wifi,
                mode: 'ios',
                translucent: true,
                position: 'bottom',
                layout: 'stacked'
            })
        }
    });
}




// settings = {
//     header?: string;
//     message?: string | IonicSafeString;
//     cssClass?: string | string[];
//     duration?: number;
//     buttons?: (ToastButton | string)[];
//     position?: 'top' | 'bottom' | 'middle';
//     translucent?: boolean;
//     animated?: boolean;
//     icon?: string;
//     htmlAttributes?: {
//       [key: string]: any;
//     };
//     layout?: ToastLayout;
//     color?: Color;
//     mode?: Mode;
//     keyboardClose?: boolean;
//     id?: string;
//     enterAnimation?: AnimationBuilder;
//     leaveAnimation?: AnimationBuilder;
//   }

let settings: ToastOptions = {
    color: 'danger',
    duration: 3000,
    message: 'Βρίσκεσαι offline!',
    icon: wifi,
    mode: 'ios',
    translucent: true,
    position: 'bottom',
    layout: 'stacked'
};


export async function logCurrentNetworkStatus () {
    const status = await Network.getStatus();
    console.log('Network status:', status);
    const toast = await toastController.create(settings);
  
     toast.present();
};