import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { alertController } from '@ionic/core';
import { t } from '$lib/i18n';
import { get } from 'svelte/store';

const openAppStore = async () => {
	await AppUpdate.openAppStore();
};

const performImmediateUpdate = async () => {
	const result = await AppUpdate.getAppUpdateInfo();
	if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
		return;
	}
	if (result.immediateUpdateAllowed) {
		await AppUpdate.performImmediateUpdate();
	}
};

const startFlexibleUpdate = async () => {
	const result = await AppUpdate.getAppUpdateInfo();
	if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
		return;
	}
	if (result.flexibleUpdateAllowed) {
		await AppUpdate.startFlexibleUpdate();
	}
};

const checkForUpdates = async () => {
	try {
		fetch(
			'https://raw.githubusercontent.com/acmauth/StudentCompanion/refs/heads/appVersion/version.json'
		).then(async (response) => {
			const data = await response.json();
			handleUpdate(data);
		});
	} catch (error) {
		console.error('Error fetching update info: ', error);
	}
};

const handleUpdate = async (result: any) => {
	const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
	const priority = result[platform].priority;
	const update = await AppUpdate.getAppUpdateInfo();

	if (update.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
		if (priority === 5) {
			const alert = await alertController.create({
				header: get(t)('update.UpdateHeaderRequired'),
				message: get(t)('update.UpdateRequired'),
				buttons: [
					{
						text: get(t)('update.UpdateNow'),
						handler: async () => {
							if (result.immediateUpdateAllowed) {
								await performImmediateUpdate();
							} else if (result.flexibleUpdateAllowed) {
								await startFlexibleUpdate();
							} else {
								await openAppStore();
							}
						}
					}
				]
			});

			await alert.present();
		} else if (priority >= 2 && priority < 5) {
			const alert = await alertController.create({
				header: get(t)('update.UpdateHeader'),
				message: get(t)('update.UpdateAvailable'),
				buttons: [
					{
						text: get(t)('update.UpdateNow'),
						handler: async () => {
							if (result.immediateUpdateAllowed) {
								await performImmediateUpdate();
							} else if (result.flexibleUpdateAllowed) {
								await startFlexibleUpdate();
							} else {
								await openAppStore();
							}
						}
					},
					{
						text: get(t)('update.UpdateLater'),
						role: 'cancel'
					}
				]
			});
			await alert.present();
		}
	}
};

export { checkForUpdates };
