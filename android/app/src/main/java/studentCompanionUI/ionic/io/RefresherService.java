package studentCompanionUI.ionic.io;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;


public class RefresherService extends Worker {
    private Context context;
    public RefresherService(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {

        try {
            JSONObject tokens = this.getCredentials();
            String refreshToken = tokens.getString("refreshToken");

            var newTokens = this.refreshToken(refreshToken);
            if (newTokens.getBoolean("success")) {
                this.updateStoredTokens(newTokens.getString("accessToken"), newTokens.getString("refreshToken"));
            }
            
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        return Result.success();
    }



    /**
     * @return the username and password stored in the shared preferences
     * @throws JSONException
     */
    private JSONObject getCredentials() throws JSONException {
        var credentials = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).getString("keycloakStore","");
        return new JSONObject(credentials);
    }

    public JSONObject refreshToken(String refresh) throws JSONException {
        String urlString = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token";
        HttpURLConnection connection = null;
        try {
            URL url = new URL(urlString);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setDoOutput(true);

            String postData = "grant_type=refresh_token&refresh_token=" + refresh + "&client_id=aristomate";

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = postData.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // Parse the JSON response
                JSONObject jsonResponse = new JSONObject(response.toString());
                String accessToken = jsonResponse.getString("access_token");
                String refreshToken = jsonResponse.getString("refresh_token");

                return new JSONObject().put("accessToken", accessToken).put("refreshToken", refreshToken).put("success", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
        return new JSONObject().put("success", false);
    }

    /**
     * @throws JSONException
     */
    private void updateStoredTokens(String accessToken, String refreshToken) throws JSONException {

        var oldTokens = this.getCredentials();
        oldTokens.put("accessToken", accessToken);
        oldTokens.put("refreshToken", refreshToken);

        SharedPreferences.Editor editor = this.context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE).edit();
        editor.putString("keycloakStore",oldTokens.toString());
        editor.apply();

    }

}