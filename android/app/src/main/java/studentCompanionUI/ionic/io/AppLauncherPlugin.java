package studentCompanionUI.ionic.io;

import android.content.Intent;
import android.content.pm.PackageManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppLauncherPlugin")
public class AppLauncherPlugin extends Plugin {

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name is required");
            return;
        }

        PackageManager pm = getContext().getPackageManager();
        Intent launchIntent = pm.getLaunchIntentForPackage(packageName);

        if (launchIntent != null) {
            getContext().startActivity(launchIntent);
            JSObject result = new JSObject();
            result.put("launched", true);
            call.resolve(result);
        } else {
            JSObject result = new JSObject();
            result.put("launched", false);
            result.put("message", "App not installed");
            call.resolve(result);
        }
    }

    @PluginMethod
    public void isAppInstalled(PluginCall call) {
        String packageName = call.getString("packageName");
        
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name is required");
            return;
        }

        PackageManager pm = getContext().getPackageManager();
        boolean installed;
        try {
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            installed = true;
        } catch (PackageManager.NameNotFoundException e) {
            installed = false;
        }

        JSObject result = new JSObject();
        result.put("installed", installed);
        call.resolve(result);
    }
}
