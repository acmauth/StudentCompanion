package studentCompanionUI.ionic.io;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import studentCompanionUI.ionic.io.notifications.NotificationServiceDefinition;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UniversisScraperDefinition.class);
        registerPlugin(ElearningScraperDefinition.class);
        registerPlugin(WebmailInboxScraperDefinition.class);
        registerPlugin(NotificationServiceDefinition.class);
        super.onCreate(savedInstanceState);
    }
}
