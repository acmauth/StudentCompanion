package studentCompanionUI.ionic.io;

import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;
import jakarta.mail.*;

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
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });
            Store store = session.getStore("imaps");
            store.connect(server, Integer.parseInt(port), username, password);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);
            int lastMessageNo =  inbox.getMessageCount() >= 21 ? inbox.getMessageCount() - 21 : 1;
            Message[] messages = inbox.getMessages(lastMessageNo, inbox.getMessageCount());

            // Create JSON array to hold email details
            JSONArray emailsArray = new JSONArray();

            // Iterate through messages and extract details

            for (int i = messages.length - 1; i >= 0; i--) {
                JSONObject emailJson = new JSONObject();
                if (messages[i].getFrom()[0].toString().split("<[^>]+>").length > 1)
                    emailJson.put("From_Name", messages[i].getFrom()[0].toString().split("<[^>]+>")[0].trim());
                emailJson.put("From_Address", messages[i].getFrom()[0].toString());
                emailJson.put("Subject", messages[i].getSubject().trim());
                emailJson.put("Date", messages[i].getSentDate().toString());
                emailJson.put("Content", getTextFromMessage(messages[i]));
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
        return response;
    }

    private static String getTextFromMessage(Message message) throws MessagingException, IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(message.getInputStream()));

        StringBuilder contentBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            contentBuilder.append(line);
            contentBuilder.append("\n");
        }

        // Get content as string
        String content = contentBuilder.toString();

        reader.close();
        return content;
    }
}
