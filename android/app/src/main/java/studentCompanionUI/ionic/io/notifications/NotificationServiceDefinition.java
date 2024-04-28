package studentCompanionUI.ionic.io.notifications;

import static studentCompanionUI.ionic.io.ElearningScraperLogic.scrape;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.time.Duration;


@CapacitorPlugin(name="NotificationServiceInitiator")
public class NotificationServiceDefinition extends Plugin{

    @PluginMethod()
    public void initialize(PluginCall call) {

        WorkManager.getInstance(this.getContext()).cancelAllWorkByTag("notifs");
        var notifWork = new PeriodicWorkRequest.Builder(NotificationService.class, Duration.ofMinutes(15)).addTag("notifs").build();
        WorkManager.getInstance(this.getContext()).enqueueUniquePeriodicWork("notifs", ExistingPeriodicWorkPolicy.REPLACE, notifWork);

        call.resolve();
    }
}