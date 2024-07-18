package studentCompanionUI.ionic.io;

import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

import java.io.ByteArrayOutputStream;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
            int lastMessageNo = inbox.getMessageCount() >= 6 ? inbox.getMessageCount() - 6 : 1;
            Message[] messages = inbox.getMessages(lastMessageNo, inbox.getMessageCount());

            // Create JSON array to hold email details
            JSONArray emailsArray = new JSONArray();

            // Iterate through messages and extract details
            for (int i = messages.length - 1; i >= 0; i--) {
                JSONObject emailJson = new JSONObject();
                emailJson.put("data", getRawMessageSource(messages[i]));
                emailJson.put("subject", getDecodedText(messages[i].getSubject()));
                emailJson.put("sender", getDecodedText(messages[i].getFrom()[0].toString()));
                emailJson.put("date", messages[i].getSentDate());
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

   private static String getDecodedText(String txt) {
       StringBuilder out = new StringBuilder();
       boolean isEncoded = txt.contains("=\\?UTF-8");

       for(String source : txt.split(" ")) {
           Pattern p = Pattern.compile("=\\?UTF-8\\?B\\?(.*?)\\?=");
           Matcher m = p.matcher(source);
           if (!m.matches()) {
               out.append(" ").append(source);
           } else {
               try {
                   out.append(MimeUtility.decodeText(source));
               } catch (Exception e) {
                   e.printStackTrace();
                   out.append(source);
               }
           }
       }
       return out.toString().trim();
   }
}
