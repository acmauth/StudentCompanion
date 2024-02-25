package studentCompanionUI.ionic.io;

import android.util.Base64;

import com.getcapacitor.JSObject;
import com.github.fracpete.requests4j.Session;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.UnsupportedEncodingException;
import java.net.HttpCookie;
import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import okhttp3.MediaType;

public class ElearningScraperLogic {

    private static final String INITIALURL = "https://elearning.auth.gr/auth/saml/index.php?wantsurl=https://elearning.auth.gr/";

    public static JSObject scrape(String username, String password) {
        Session session = new Session();

        try {

            // Step 1: Initial GET request
            var response1 = session.get(INITIALURL).execute();
            var resp_url1 = response1.rawResponse().request().url().toString();
            var URLStates = resp_url1.split("\\?AuthState=");
            var auth_state1 = URLStates[1];
            var post_url1 = URLStates[0];
            var authStateDecoded = URLDecoder.decode(auth_state1, "utf-8");


            // Step 2: POST Auth state and credentials
            // Important: The content-type header must be set to application/x-www-form-urlencoded, otherwise the request will fail
            var response2 = session.post(post_url1)
                    .body(new FormBuilder()
                            .add("username", username)
                            .add("password", password)
                            .add("AuthState", authStateDecoded).build(), MediaType.parse("application/x-www-form-urlencoded"))
                    .execute();

            Document responsePage2 = Jsoup.parse(response2.text());
            Element formElements2 = responsePage2.selectFirst("form[action]");
            String form2_url = stripData(responsePage2, formElements2, "action");

            formElements2 = responsePage2.selectFirst("input[name=SAMLResponse]");
            String samlResponse2 = stripData(responsePage2, formElements2, "value");

            formElements2 = responsePage2.selectFirst("input[name=RelayState]");
            String relayState2 = stripData(responsePage2, formElements2, "value");


            // Step 3: POST SAMLResponse and RelayState
            var response3 = session.post(form2_url)
                    .body(new FormBuilder()
                            .add("SAMLResponse", samlResponse2)
                            .add("RelayState", relayState2).build(), MediaType.parse("application/x-www-form-urlencoded"))
                    .execute();

            Document responsePage3 = Jsoup.parse(response3.text());


            // Step 4, parsing the returned data
            String sesskey = "";
            String moodleSession = "";
            String userID = "";


            // Scraping the session key!
            Elements scriptTags = responsePage3.select("script");

            for (Element scriptTag : scriptTags) {
                // Check if the script tag contains 'M.cfg'
                if (scriptTag.html().contains("M.cfg")) {

                // Get the HTML content of the script element
                String scriptContent = scriptTag.html();

                if (scriptContent != null && !scriptContent.isEmpty()) {
                    // Extract the JSON content from the script
                    String jsonContent = scriptContent.split("M.cfg = ")[1].split(";")[0];

                    try {
                        sesskey = new JSONObject(jsonContent).getString("sesskey");
                        System.out.println("sesskey: " + sesskey);
                        break;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("Step4: Script content is null or empty");
                }

                }
            }

            // Scraping the user ID!
            Elements elementsWithDataUserId = responsePage3.select("[data-user-id]");

            // Iterate through the selected elements
            for (Element element : elementsWithDataUserId) {
                // Get the data-user-id attribute value
                String userIdAttr = element.attr("data-user-id");

                // Check if the attribute value is not empty
                if (userIdAttr != null && !userIdAttr.trim().isEmpty()) {
                    userID = userIdAttr.trim();
                    break; // Break the loop after finding the first non-empty attribute
                }
            }

            if (userID.isBlank()) {
                System.out.println("Step4: userID is undefined");
            } else {
                System.out.println("userID: " + userID);
            }


            // Scraping the MoodleSession cookie!
            var elearningCookies = session.cookies().getCookieStore().get(new URI("https://elearning.auth.gr"));
            for (HttpCookie cookie: elearningCookies) {
                if (cookie.getName().equalsIgnoreCase("MoodleSession")){
                    moodleSession = cookie.getValue();
                }
            }

            var response = new JSObject();
            response.put("error", null);
            response.put("credentials", new JSObject()
                    .put("sesskey", sesskey)
                    .put("moodleSession", moodleSession)
                    .put("userID", userID));
            System.out.println(response.toString());
            return response;


        } catch (Exception e) {
            e.printStackTrace();
        }

        var response = new JSObject();
        response.put("error", true);
        response.put("reason", "error");
        return response;
    }

    private static byte[] generateRandomBytes(int length) throws NoSuchAlgorithmException {
        SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        return randomBytes;
    }

    private static String generateCodeVerifier() throws NoSuchAlgorithmException {
        byte[] buffer = generateRandomBytes(64);
        return Base64.encodeToString(buffer, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }

    private static String generateCodeChallenge(String codeVerifier) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(codeVerifier.getBytes());
        byte[] digest = md.digest();
        return Base64.encodeToString(digest, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }

    private static String paramsToString(Map<String, String> params) {
        StringBuilder parameterString = new StringBuilder("?");
        Set<Map.Entry<String, String>> entrySet = params.entrySet();
        for (Map.Entry<String, String> entry : entrySet) {
            parameterString.append("&").append(entry.getKey()).append("=").append(entry.getValue());
        }
        return parameterString.substring(1);
    }

    private static String stripData(Document page, Element formElements, String param) {
        String url = formElements.attr(param);
        if (url != null && !url.isEmpty()) {
            return url;
        } else {
            throw new RuntimeException("Empty URL list");
        }
    }

    private static class FormBuilder {
        private Map<String, String> data = new HashMap<>();

        public FormBuilder add(String key, String value) throws UnsupportedEncodingException {
            return this.add(key, value, true);
        }

        public FormBuilder add(String key, String value, boolean encode) throws UnsupportedEncodingException {
            if (encode) {
                data.put(key, URLEncoder.encode(value, "utf-8"));
            } else {
                data.put(key, value);
            }
            return this;
        }

        public String build() {
            StringBuilder builder = new StringBuilder();
            for (Map.Entry<String, String> entry : data.entrySet()) {
                builder.append("&").append(entry.getKey()).append("=").append(entry.getValue());
            }
            return builder.substring(1);
        }
    }

}
