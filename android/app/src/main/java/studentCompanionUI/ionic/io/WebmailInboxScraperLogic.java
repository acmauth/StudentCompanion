package studentCompanionUI.ionic.io;

import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

import java.io.ByteArrayOutputStream;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.ByteArrayOutputStream;
import java.util.*;

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
            int lastMessageNo = inbox.getMessageCount() >= 8 ? inbox.getMessageCount() - 8 : 1;
            Message[] messages = inbox.getMessages(lastMessageNo, inbox.getMessageCount());

            // Create JSON array to hold email details
            JSONArray emailsArray = new JSONArray();

            // Iterate through messages and extract details
            for (int i = messages.length - 1; i >= 0; i--) {
                JSONObject emailJson = new JSONObject();
                emailJson.put("data", getRawMessageSource(messages[i]));
                emailsArray.put(emailJson);
            }

            // Close connections
            inbox.close(false);
            store.close();

            var response = new JSObject();
            response.put("error", null);
            response.put("received", emailsArray);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
        }

        var response = new JSObject();
        response.put("error", true);
        return response;
    }

    private static String getRawMessageSource(Message message) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        message.writeTo(outputStream);
        return outputStream.toString();
    }
}
