package studentCompanionUI.ionic.io.notifications;

import static androidx.core.content.ContextCompat.getSystemService;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.github.fracpete.requests4j.Session;
import com.github.fracpete.requests4j.response.BasicResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;


import studentCompanionUI.ionic.io.ElearningDataServiceLogic;
import studentCompanionUI.ionic.io.ElearningScraperLogic;
import studentCompanionUI.ionic.io.R;
import studentCompanionUI.ionic.io.UniversisScraperLogic;
import studentCompanionUI.ionic.io.WebmailInboxScraperLogic;

class AristomateNotification {
    public String title;
    public String message;
    public String sender;
    public String source;
    public int Timestamp;
    AristomateNotification(String title, String message, String sender, int Timestamp, String source) {
        this.title = title;
        this.message = message;
        this.Timestamp = Timestamp;
        this.sender = sender;
        this.source = source;
    }
}


public class NotificationService extends Worker {
    private Context context;
    public NotificationService(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
        createNotificationChannels();
    }

    @NonNull
    @Override
    public Result doWork() {

        // Workidy-do
        var notifications = gatherNotifications((int) (System.currentTimeMillis() - TimeUnit.MINUTES.toMillis(5)));
//        var notifications = gatherNotifications(1711185542);

        Log.d("Notification Content doWork()", "Notifications gathered: " + notifications.length);

        displayNotifications(notifications);

        return Result.success();
    }

    private static JSONArray notificationChannels;

    static {
        try {
            notificationChannels = new JSONArray()
                    .put(new JSONObject()
                            .put("name","Universis")
                            .put("description","universis")
                            .put("color","#FF0000"))
                    .put(new JSONObject()
                            .put("name","Elearning")
                            .put("description","elearning")
                            .put("color","#00FF00"))
                    .put(new JSONObject()
                            .put("name","Webmail")
                            .put("description","webmail")
                            .put("color","#0000FF"));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    private void createNotificationChannels() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is not in the Support Library.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            for (int i=0; i < notificationChannels.length(); i++) {
                try {
                    JSONObject channelConfig = notificationChannels.getJSONObject(i);
                    CharSequence name = channelConfig.getString("name");
                    String description = channelConfig.getString("description");

                    int importance = NotificationManager.IMPORTANCE_DEFAULT;
                    NotificationChannel channel = new NotificationChannel((String) name, name, importance);
                    channel.setDescription(description);
                    // Register the channel with the system; you can't change the importance
                    // or other notification behaviors after this.
                    NotificationManager notificationManager = getSystemService(this.context, NotificationManager.class);
                    notificationManager.createNotificationChannel(channel);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            }

        }
    }

    private void displayNotifications (AristomateNotification[] notifications){
        for (AristomateNotification notification : notifications){
            // Display the notification on android
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this.context, notification.source)
                    .setSmallIcon(R.drawable.aristomate)
                    .setContentTitle(notification.title)
                    .setContentText(notification.message)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT);

            NotificationManager notificationManager = getSystemService(this.context, NotificationManager.class);
            assert notificationManager != null;
            notificationManager.notify(new Random().nextInt(), builder.build());

        }
    }

    private AristomateNotification[] gatherNotifications(int timestamp){
        var notifications = new ArrayList<AristomateNotification>();

        try {
            // Gathering universis
            try {
                var universisNotifications = getUniversisNotifications(timestamp);
                notifications.addAll(Arrays.asList(universisNotifications));
            } catch (Exception e) {
                try {
                    updateStoredUniversisToken();
                    var universisNotifications = getUniversisNotifications(timestamp);
                    notifications.addAll(Arrays.asList(universisNotifications));
                } catch (Exception e2) {
                    e2.printStackTrace();
                }
            }

            // Gathering eLearning
            try {
                var elearningNotifications = getElearningNotifications(timestamp);
                notifications.addAll(Arrays.asList(elearningNotifications));
            } catch (Exception e) {
                try {
                    updateStoredElearningToken();
                    var elearningNotifications = getUniversisNotifications(timestamp);
                    notifications.addAll(Arrays.asList(elearningNotifications));
                } catch (Exception e2) {
                    e2.printStackTrace();
                }
            }

            // Gathering webmail
            try {
                var webmailNotifications = getWebmailNotifications(timestamp);
                notifications.addAll(Arrays.asList(webmailNotifications));
            } catch (Exception e) {
                e.printStackTrace();
            }

            AtomicInteger i = new AtomicInteger();
            notifications.forEach(notification -> {
                Log.d("Notification Content gatherNotifications()", "Notification: " + i.getAndIncrement());
                Log.d("Notification Content gatherNotifications()", "Title: " + notification.title);
                Log.d("Notification Content gatherNotifications()", "Message: " + notification.message);
                Log.d("Notification Content gatherNotifications()", "Sender: " + notification.sender);
                Log.d("Notification Content gatherNotifications()", "Source: " + notification.source);
                Log.d("Notification Content gatherNotifications()", "Timestamp: " + notification.Timestamp);
            });

            return notifications.toArray(new AristomateNotification[0]);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * @return the username and password stored in the shared preferences
     * @throws JSONException
     */
    private JSONObject getCredentials() throws JSONException {
        var credentials = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("usercredentials","");
        return new JSONObject(credentials);
    }

    /**
     * @return the token stored in the shared preferences
     * @throws JSONException
     */
    private String updateStoredUniversisToken() throws JSONException {
        JSONObject credentials = getCredentials();

        var username = credentials.getString("username");
        var password = credentials.getString("password");

        var token = UniversisScraperLogic.scrape(username,password).getString("token");
        if (token == null) return null;

        var oldTokens = new JSONObject(this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("userTokens",""));
        // Setting the token in oldTokens.universis.token
        oldTokens.getJSONObject("universis").put("token",token);

        SharedPreferences.Editor editor = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).edit();
        editor.putString("userTokens",oldTokens.toString());
        editor.apply();

        return token;
    }

    /**
     * @return the token stored in the shared preferences
     * @throws JSONException
     */
    private JSONObject updateStoredElearningToken() throws JSONException {
        JSONObject credentials = getCredentials();

        var username = credentials.getString("username");
        var password = credentials.getString("password");

        JSONObject response = ElearningScraperLogic.scrape(username,password);
        try {
            if (response.has("error") && response.getBoolean("error")){
                return null;
            }
        } catch (JSONException e) {
            System.out.println(response.toString());
            Log.d("Notification Content updateStoredElearningToken()", response.toString());
            throw new RuntimeException(e);
        }

        JSONObject credentialsObject = response.getJSONObject("credentials");

        var oldTokens = new JSONObject(this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("userTokens",""));

        // Setting the new credentials in oldTokens.elearning.token
        oldTokens.put("elearning",credentialsObject);

        SharedPreferences.Editor editor = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).edit();
        editor.putString("userTokens",oldTokens.toString());
        editor.apply();

        return credentialsObject;
    }

    private AristomateNotification[] getUniversisNotifications(int timestamp){
        try {
            Instant instant = Instant.ofEpochMilli(timestamp);
            ZonedDateTime threshHoldTime = instant.atZone(ZoneOffset.UTC);

            JSONObject tokens = new JSONObject(this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("userTokens",""));
            String token = tokens.getJSONObject("universis").getString("token");

            Session session = new Session();
            BasicResponse api_result = session.get("https://universis-api.it.auth.gr/api/students/me/messages?$top=3")
                    .header("Authorization","Bearer " + token)
                    .execute();
            // {
            //    "value": [
            //        {
            //            "subject": null,
            //            "body": "Ένα επισυναπτόμενο αρχείο είναι διαθέσιμο.",
            //            "sender": 1
            //            "dateReceived": "2020-10-30T12:52:26.712+02:00",
            //            "id": 64387
            //        }
            //    ]
            //}
            var universisNotifications = new ArrayList<AristomateNotification>();

            JSONArray result = new JSONObject(api_result.text()).getJSONArray("value");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            for (int i=0; i < result.length(); i++) {
                JSONObject candidateNotification = result.getJSONObject(i);
                ZonedDateTime dateReceived = ZonedDateTime.parse(candidateNotification.getString("dateReceived"), formatter);

                if (dateReceived.isAfter(threshHoldTime)){
                    universisNotifications.add(new AristomateNotification(null,candidateNotification.getString("body"), null ,(int)dateReceived.toEpochSecond(), "Universis"));
                }
            }


            return universisNotifications.toArray(new AristomateNotification[0]);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private AristomateNotification[] getElearningNotifications(int timestamp){
        try {
            Instant instant = Instant.ofEpochMilli(timestamp);
            ZonedDateTime threshHoldTime = instant.atZone(ZoneOffset.UTC);

            // Getting the elearning credentials
            JSONObject tokens = new JSONObject(this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("userTokens",""));
            JSONObject elearningCredentials = tokens.getJSONObject("elearning");

            String sesskey = elearningCredentials.getString("sesskey");
            String moodleSession = elearningCredentials.getString("moodleSession");
            String userID = elearningCredentials.getString("userID");

            JSONObject dataArguments = new JSONObject()
                    .put("index",0)
                    .put("methodname","core_message_get_messages")
                    .put("args",new JSONObject()
                            .put("useridto",userID)
                            .put("useridfrom",0)
                            .put("type","notifications")
                            .put("limitfrom",0)
                            .put("limitnum",3)
                            .put("newestfirst",1)
                            .put("read", 0)
                    );

            JSONObject response = ElearningDataServiceLogic.get(sesskey, moodleSession, dataArguments.toString());
            if (response.getBoolean("error")){
                throw new RuntimeException("Error in ElearningDataServiceLogic.get");
            }

            JSONArray messages = response.getJSONObject("data").getJSONArray("messages");
            var elearningNotifications = new ArrayList<AristomateNotification>();

            Log.e("in get mails","here");

            for (int i=0; i < messages.length(); i++) {
                JSONObject candidateNotification = messages.getJSONObject(i);
                ZonedDateTime dateReceived = Instant.ofEpochSecond(candidateNotification.getInt("timecreated")).atZone(ZoneOffset.UTC);

                Log.e("In mailQ",dateReceived.toString());
                if (dateReceived.isAfter(threshHoldTime)){
                    elearningNotifications.add(new AristomateNotification(candidateNotification.getString("subject"),candidateNotification.getString("fullmessage"), candidateNotification.getString("userfromfullname"), (int)dateReceived.toEpochSecond(), "Elearning"));
                }
            }


            return elearningNotifications.toArray(new AristomateNotification[0]);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private AristomateNotification[] getWebmailNotifications(int timestamp){
        try {
            Instant instant = Instant.ofEpochMilli(timestamp);
            ZonedDateTime threshHoldTime = instant.atZone(ZoneOffset.UTC);

            JSONObject credentials = getCredentials();
            String username = credentials.getString("username");
            String password = credentials.getString("password");

            JSONObject emails = WebmailInboxScraperLogic.getInboxEmails(username,password,"mail.auth.gr","993");

            if (emails.has("error") && emails.getBoolean("error")){
                throw new RuntimeException("Error in WebmailInboxScraperLogic.getInboxEmails");
            }

            JSONArray received = emails.getJSONArray("received");
            var webmailNotifications = new ArrayList<AristomateNotification>();

            for (int i=0; i < received.length(); i++) {
                JSONObject candidateNotification = received.getJSONObject(i);

                String notificationSubject = candidateNotification.getString("subject");
                String notificationSender = candidateNotification.getString("sender");
                Date notificationDate = (Date) candidateNotification.get("date");

                ZonedDateTime dateReceived = Instant.ofEpochMilli(notificationDate.getTime()).atZone(ZoneOffset.UTC);
                if (dateReceived.isAfter(threshHoldTime)){
                    webmailNotifications.add(new AristomateNotification(notificationSender,notificationSubject,notificationSender, (int)dateReceived.toEpochSecond(), "Webmail"));
                }
            }

            return webmailNotifications.toArray(new AristomateNotification[0]);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}