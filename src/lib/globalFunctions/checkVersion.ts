import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
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
		await fetch(
			'https://raw.githubusercontent.com/acmauth/StudentCompanion/refs/heads/dev/version.json'
		).then(async (response) => {
			const data = await response.json();
			handleUpdate(data);
		});
	} catch (error) {
		console.error('Error fetching update info: ', error);
	}
};

const findMaxPriorityAfterCurrent = (
	platform: string,
	currentVersionCode: number,
	data: { [x: string]: { versions: any } }
) => {
	const versions = data[platform].versions;

	// If the platform doesn't exist or the list is empty, return 0
	if (!versions || versions.length === 0) {
		return 0;
	}

	// Find the maximum priority for versions that have a higher versionCode than the current one
	let maxPriority = 0;
	for (const version of versions) {
		if (version.versionCode > currentVersionCode) {
			maxPriority = Math.max(maxPriority, version.priority);
		}
	}

	return maxPriority;
};

const handleUpdate = async (result: any) => {
	const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
	const update = await AppUpdate.getAppUpdateInfo();
	const currentVersion = await App.getInfo().then((info) => info.build);
	const maxPriority = findMaxPriorityAfterCurrent(platform, parseInt(currentVersion), result);

	if (update.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
		if (maxPriority === 5) {
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
		} else if (maxPriority >= 2 && maxPriority < 5) {
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
