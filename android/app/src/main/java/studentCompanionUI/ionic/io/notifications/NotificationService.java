package studentCompanionUI.ionic.io.notifications;

import static androidx.core.content.ContextCompat.getSystemService;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import studentCompanionUI.ionic.io.ElearningDataServiceLogic;
import studentCompanionUI.ionic.io.ElearningScraperLogic;
import studentCompanionUI.ionic.io.MainActivity;
import studentCompanionUI.ionic.io.R;
import studentCompanionUI.ionic.io.UniversisScraperLogic;
import studentCompanionUI.ionic.io.WebmailInboxScraperLogic;

class AristomateNotification {
    public String title;
    public String message;
    public String sender;
    public String source;
    public long Timestamp;
    AristomateNotification(String title, String message, String sender, long Timestamp, String source) {
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
        long lastTimestamp = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getLong("lastTimestamp", System.currentTimeMillis());
        Log.d("Notification Content doWork()", "Last timestamp: " + lastTimestamp / 1000); //1714122356
        var notifications = gatherNotifications((long) lastTimestamp / 1000);
//        var notifications = gatherNotifications((long) 0);


        Log.d("Notification Content doWork()", "Notifications gathered: " + notifications.length);

        displayNotifications(notifications);

        // Updating the last timestamp
        SharedPreferences.Editor editor = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).edit();
        editor.putLong("lastTimestamp", System.currentTimeMillis());
        editor.apply();

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


    private void displayNotifications(AristomateNotification[] notifications) {
        for (AristomateNotification notification : notifications) {
            Intent intent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    (int) notification.Timestamp,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

            NotificationCompat.Builder builder = new NotificationCompat.Builder(this.context, notification.source)
                    .setSmallIcon(R.drawable.aristomate)
                    .setContentTitle(notification.title)
                    .setContentText(notification.message)
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(notification.message))
                    .setColor(0x358af2)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true);

            long notificationId = notification.Timestamp;

            NotificationManager notificationManager = getSystemService(this.context, NotificationManager.class);
            assert notificationManager != null;
            notificationManager.notify((int) notificationId, builder.build());
        }
    }


    private AristomateNotification[] gatherNotifications(long timestamp){
        var notifications = new ArrayList<AristomateNotification>();

        try {
            // Gathering universis
            try {
                var universisNotifications = getUniversisNotifications(timestamp);
                notifications.addAll(Arrays.asList(universisNotifications));
            }  catch (Exception e) {
                e.printStackTrace();
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
    

    private AristomateNotification[] getUniversisNotifications(long timestamp){
        try {

            JSONObject loginStore = new JSONObject(this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("loginStore",""));
            String token = loginStore.getString("access_token");

            Session session = new Session();
            BasicResponse api_result = session.get("https://universis-api.it.auth.gr/api/Students/me/messages?$orderby=dateReceived desc, dateCreated desc&$top=3")
                    .header("Authorization","Bearer " + token)
                    .execute();

            var universisNotifications = new ArrayList<AristomateNotification>();

            JSONArray result = new JSONObject(api_result.text()).getJSONArray("value");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            for (int i=0; i < result.length(); i++) {
                JSONObject candidateNotification = result.getJSONObject(i);
                var receivedDateString = candidateNotification.getString("dateReceived");
                if (receivedDateString.equalsIgnoreCase("null")){
                    receivedDateString = candidateNotification.getString("dateCreated");
                    if (receivedDateString.equalsIgnoreCase("null")) {
                        receivedDateString = formatter.format(ZonedDateTime.now());
                    }
                }
                ZonedDateTime dateReceived = ZonedDateTime.parse(receivedDateString, formatter);
                long timeReceived = dateReceived.toEpochSecond();
                if (timeReceived > timestamp){
                    String plainText = candidateNotification.getString("body").replaceAll("\\<.*?\\>", "");
                    var subject = candidateNotification.getString("subject");
                    if (subject .equalsIgnoreCase("null")) {
                        subject = "Universis";
                    }
                    universisNotifications.add(new AristomateNotification(subject, plainText, "Universis" ,dateReceived.toEpochSecond(), "Universis"));
                }
            }


            return universisNotifications.toArray(new AristomateNotification[0]);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    

    private AristomateNotification[] getWebmailNotifications(long timestamp){
        try {

            JSONObject credentials = getCredentials();
            String username = credentials.getString("username");
            String password = credentials.getString("password");

            JSONObject emails = WebmailInboxScraperLogic.getInboxEmails(username,password,"mail.auth.gr","993", true, false);

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
                long timeReceived = dateReceived.toEpochSecond();
                if (timeReceived > timestamp){
                    webmailNotifications.add(new AristomateNotification(notificationSender,notificationSubject,notificationSender, dateReceived.toEpochSecond(), "Webmail"));
                }
            }

            return webmailNotifications.toArray(new AristomateNotification[0]);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}