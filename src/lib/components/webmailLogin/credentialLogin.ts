import { alertController, toastController } from 'ionic-svelte';
import type { ToastOptions } from '@ionic/core';
import { userCredsFlag as autheticationFlag } from '$components/webmailLogin/userCredsFlagStore';
import { userCreds } from '$stores/credentials.store';
import { t } from "$lib/i18n";
import { get } from 'svelte/store';

async function showToast(toast: ToastOptions) {
    const toast_ = await toastController.create(toast);
    toast_.present();
}

async function checkCredsValidity(username: string, password: string) {
    // TODO: Implement proper credential checking
    autheticationFlag.set(true);
    userCreds.set({ username, password });
    return true;
}

export async function showLoginAlert() {
    const alert = await alertController.create({
        header: get(t)("credential.title"),
        inputs: [
            {
                name: 'username',
                type: 'text',
                placeholder: get(t)("credential.academic_name"),
            },
            {
                name: 'password',
                type: 'password',
                placeholder: get(t)("credential.password"),
            }
        ],
        buttons: [
            {
                text: get(t)("credential.cancel") ?? 'Cancel',
                role: 'cancel',
            },
            {
                text: get(t)("credential.login") ?? 'Login',
                handler: async (data: { username: string; password: string }) => {
                    const username = data.username?.trim();
                    const password = data.password;
                    if (!username || !password) {
                        await showToast({
                            color: 'danger',
                            duration: 1000,
                            message: get(t)("credential.missing_fields") ?? 'Please fill in both fields.',
                            mode: 'ios',
                            translucent: true,
                            layout: 'stacked',
                        });
                        return false;
                    }
                    const validity = await checkCredsValidity(username, password);
                    if (!validity) {
                        await showToast({
                            color: 'danger',
                            duration: 1000,
                            message: get(t)("credential.failed"),
                            mode: 'ios',
                            translucent: true,
                            layout: 'stacked',
                        });
                        return false;
                    } else {
                        await showToast({
                            color: 'success',
                            duration: 1000,
                            message: get(t)("credential.success"),
                            mode: 'ios',
                            translucent: true,
                            layout: 'stacked',
                        });
                        return true;
                    }
                }
            }
        ],
        mode: 'ios',
    });
    await alert.present();
}
