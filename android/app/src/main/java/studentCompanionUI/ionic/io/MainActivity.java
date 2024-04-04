package studentCompanionUI.ionic.io;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UniversisScraperDefinition.class);
        registerPlugin(ElearningScraperDefinition.class);
        registerPlugin(WebmailInboxScraperDefinition.class);
        super.onCreate(savedInstanceState);
    }
}
