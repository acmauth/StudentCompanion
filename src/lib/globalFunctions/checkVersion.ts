import { AppUpdate, AppUpdateInfo, AppUpdateAvailability} from '@capawesome/capacitor-app-update';

const checkForUpdates = async () => {
	try {
	  const result = await AppUpdate.getAppUpdateInfo();
	  handleUpdate(result);
	} catch (error) {
	  console.error("Error fetching update info: ", error);
	}
  };
  

  const handleUpdate = (result: AppUpdateInfo) => {
	if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
	  if (result.updatePriority !== undefined && result.updatePriority >= 2 && result.updatePriority <= 4) {
		// Moderate update
		showUpdateNotification(false);
	  } else if (result.updatePriority === 5) {
		// Critical update
		showUpdateNotification(true);
	  }
	}
  };

  const showUpdateNotification = (isCriticalUpdate: boolean) => {
	const alert = document.createElement('ion-alert');
	alert.header = isCriticalUpdate ? 'Critical Update Required' : 'Update Available';
	alert.message = isCriticalUpdate 
	  ? 'A critical update is required. You must update to continue.' 
	  : 'A new update is available. Would you like to update now?';
  
	// Buttons for critical updates
	const buttons = [
	  {
		text: 'Update Now',
		handler: async () => {
		  await AppUpdate.performImmediateUpdate();
		}
	  }
	];
  
	// Add the "Later" option for moderate updates
	if (!isCriticalUpdate) {
		buttons.unshift({
		  text: 'Later',
		  handler: async () => {
			return console.log('Alert canceled');
		  },
		});
	  }
  
	alert.buttons = buttons;
  
	document.body.appendChild(alert);
	return alert.present();
  };
  
  

export { checkForUpdates };
