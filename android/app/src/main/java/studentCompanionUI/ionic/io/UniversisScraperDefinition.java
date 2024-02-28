package studentCompanionUI.ionic.io;


import static studentCompanionUI.ionic.io.UniversisScraperLogic.scrape;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "UniversisScraper")
public class UniversisScraperDefinition extends Plugin {

    @PluginMethod()
    public void authenticate(PluginCall call) {
        String username = call.getString("username", "");
        String password = call.getString("password", "");

        assert username != null;
        assert password != null;
        call.resolve(scrape(username, password));
    }

}
