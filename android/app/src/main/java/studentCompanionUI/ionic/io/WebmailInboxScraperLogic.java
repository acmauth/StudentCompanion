package studentCompanionUI.ionic.io;

import com.getcapacitor.JSObject;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.Properties;
import javax.mail.*;

public class WebmailInboxScraperLogic {

    public static JSObject getInboxEmails(String username, String password, String server, String port) {
        try {
            // IMAP settings
            Properties props = new Properties();
            props.setProperty("mail.store.protocol", "imaps");
            props.setProperty("mail.imap.ssl.enable", "true");
            props.setProperty("mail.imap.host", server);
            props.setProperty("mail.imap.port", port);

            // Connect to the server
            Session session = Session.getDefaultInstance(props);
            Store store = session.getStore("imaps");
            store.connect(server, Integer.parseInt(port), username, password);

            // Open the inbox folder
            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            // Fetch messages
            Message[] messages = inbox.getMessages();

            // Create JSON array to hold email details
            JSONArray emailsArray = new JSONArray();

            // Iterate through messages and extract details
            for (Message message : messages) {
                JSONObject emailJson = new JSONObject();
                emailJson.put("From", Arrays.toString(message.getFrom()));
                emailJson.put("Subject", message.getSubject());
                emailJson.put("Date", message.getSentDate().toString());
                emailJson.put("Content", message.getContent().toString());
                emailsArray.put(emailJson);
            }

            // Close connections
            inbox.close(false);
            store.close();

            var response = new JSObject();
            response.put("error", null);
            response.put("received", emailsArray);
            System.out.println(response);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }

        var response = new JSObject();
        response.put("error", true);
        System.out.println(response);
        return response;
    }
}
