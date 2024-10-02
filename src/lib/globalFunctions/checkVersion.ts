import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { alertController } from '@ionic/core';

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
				header: 'Update Required',
				message: 'A new version of the app is available. Please update to the latest version.',
				buttons: [
					{
						text: 'Update Now',
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
				header: 'Update Available',
				message: 'A new version of the app is available. Would you like to update?',
				buttons: [
					{
						text: 'Update Now',
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
						text: 'Later',
						role: 'cancel'
					}
				]
			});
			await alert.present();
		}
	}
};

export { checkForUpdates };
