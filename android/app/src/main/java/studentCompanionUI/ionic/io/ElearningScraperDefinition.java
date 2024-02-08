package studentCompanionUI.ionic.io;

import static studentCompanionUI.ionic.io.ElearningScraperLogic.scrape;
import static studentCompanionUI.ionic.io.ElearningDataServiceLogic.get;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="ElearningScraper")
public class ElearningScraperDefinition extends Plugin {

    @PluginMethod()
    public void authenticate(PluginCall call) {
        String username = call.getString("username", "");
        String password = call.getString("password", "");

        assert username != null;
        assert password != null;
        call.resolve(scrape(username, password));
    }

    @PluginMethod
    public void apiGet(PluginCall call){
        String sesskey = call.getString("sesskey", "");
        String moodleSession = call.getString("moodleSession", "");
        String dataArguments = call.getString("dataArguments", "");

        call.resolve(get(sesskey, moodleSession, dataArguments));
    }

}
