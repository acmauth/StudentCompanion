package studentCompanionUI.ionic.io;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.time.Duration;


@CapacitorPlugin(name="RefresherServiceInitiator")
public class RefresherServiceDefinition extends Plugin{

    @PluginMethod()
    public void initialize(PluginCall call) {

        WorkManager.getInstance(this.getContext()).cancelAllWorkByTag("keycloakRefresher");
        var refresherWork = new PeriodicWorkRequest.Builder(RefresherService.class, Duration.ofMinutes(15)).addTag("keycloakRefresher").build();
        WorkManager.getInstance(this.getContext()).enqueueUniquePeriodicWork("keycloakRefresher", ExistingPeriodicWorkPolicy.REPLACE, refresherWork);

        call.resolve();
    }
}