import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateInfo, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { alertController } from '@ionic/core';

const getCurrentAppVersion = async () => {
	const result = await AppUpdate.getAppUpdateInfo();
	if (Capacitor.getPlatform() === 'android') {
		return result.currentVersionCode;
	} else {
		return result.currentVersionName;
	}
};

const getAvailableAppVersion = async () => {
	const result = await AppUpdate.getAppUpdateInfo();
	if (Capacitor.getPlatform() === 'android') {
		return result.availableVersionCode;
	} else {
		return result.availableVersionName;
	}
};

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

const completeFlexibleUpdate = async () => {
	await AppUpdate.completeFlexibleUpdate();
};

const checkForUpdates = async () => {
	try {
		const result = await AppUpdate.getAppUpdateInfo();
		handleUpdate(result);
	} catch (error) {
		console.error('Error fetching update info: ', error);
	}
};

const handleUpdate = async (result: AppUpdateInfo) => {
	console.log('kek2 ' + JSON.stringify(result));
	if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
		let message = '';

		message = 'A moderate update is available. Please update the app for a better experience.';

		const alert = await alertController.create({
			header: 'Update Available',
			message: message,
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
};

export { checkForUpdates };
