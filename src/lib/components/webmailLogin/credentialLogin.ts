import { alertController, toastController } from 'ionic-svelte';
import sisAuthenticator from "$lib/-universis/authenticator-deprecated/core";
import type { ToastOptions } from '@ionic/core';
import { userCreds, useAlternativeLogin } from '$stores/credentials.store';
import { userCredsFlag as autheticationFlag } from '$components/webmailLogin/userCredsFlagStore';
import { t } from "$lib/i18n";
import { get } from 'svelte/store';

async function showToast(toast: ToastOptions) {
    const toast_ = await toastController.create(toast);
    toast_.present();
}

async function checkCredsValidity(username: string, password: string) {
    const authResult = await sisAuthenticator(username, password);
    if (authResult.error == null && authResult.token) {
        userCreds.set({ username, password });
        useAlternativeLogin.set(true);
        autheticationFlag.set(true);
        return true;
    }
    return false;
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
