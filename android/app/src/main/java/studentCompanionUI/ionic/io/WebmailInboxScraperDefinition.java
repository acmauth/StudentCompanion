package studentCompanionUI.ionic.io;


import static studentCompanionUI.ionic.io.WebmailInboxScraperLogic.getInboxEmails;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WebmailInboxScraper")
public class WebmailInboxScraperDefinition extends Plugin {

    @PluginMethod()
    public void getInbox(PluginCall call) {
        String username = call.getString("username", "");
        String password = call.getString("password", "");
        String server = call.getString("server", "");
        String port = call.getString("port", "");
        Boolean validate = call.getBoolean("validate", false);

        assert username != null;
        assert password != null;
        assert server != null;
        assert port != null;
        assert validate != null;
        call.resolve(getInboxEmails(username, password, server, port, false, validate));
    }

}
