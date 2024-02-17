package studentCompanionUI.ionic.io;

import static com.github.fracpete.requests4j.json.Dictionary.newDict;

import com.getcapacitor.JSObject;

import android.util.Base64;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import okhttp3.MediaType;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import com.github.fracpete.requests4j.Session;
import com.github.fracpete.requests4j.form.FormData;


public class UniversisScraperLogic {

    private static final String AUTHORIZE_URL = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/auth";
    private static final String CALLBACK_URL = "https://students.auth.gr/auth/callback/index.html";
    private static final String TOKEN_URL = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token";
    private static final String CLIENT_ID = "students";
    private static final String SCOPE = "students";

    public static JSObject scrape(String username, String password) {
        Session session = new Session();

        try {
            // Step 1: Initial GET request
            String state = Base64.encodeToString(generateRandomBytes(8), Base64.NO_WRAP);
            String codeVerifier = generateCodeVerifier();
            String codeChallenge = generateCodeChallenge(codeVerifier);

            // Setting the parameters
            Map<String, String> params = new HashMap<>();
            params.put("redirect_uri", CALLBACK_URL);
            params.put("response_type", "code");
            params.put("client_id", CLIENT_ID);
            params.put("code_challenge", codeChallenge);
            params.put("code_challenge_method", "S256");
            params.put("scope", SCOPE);
            params.put("state", state);

            // Appending the parameters to the URL
            String extendedURL = AUTHORIZE_URL + "?" + paramsToString(params);

            // Performing the request
            var response1 = session.get(extendedURL).headers(PreHeaders.H1()).execute();
            System.out.println("response1" + response1.statusCode());
            var responsePage = Jsoup.parse(response1.text());

            // Scraping for the form URL, SAMLRequest, RelayState
            Element formElements = responsePage.selectFirst("form[action]");
            String formUrl = stripData(responsePage, formElements, "action");

            formElements = responsePage.selectFirst("input[name=SAMLRequest]");
            String samlRequest = stripData(responsePage, formElements, "value");

            formElements = responsePage.selectFirst("input[name=RelayState]");
            String relayState = stripData(responsePage, formElements, "value");

            // Step 2: POST SAMLRequest and RelayState
            var response2 = session.post(formUrl).headers(PreHeaders.H2())
                    .formData(new FormData()
                            .add("SAMLRequest", samlRequest)
                            .add("RelayState", relayState))
                    .execute();
            System.out.println("response2" + response2.statusCode());
            var response2URL = response2.rawResponse().request().url().toString();

            String form2Url = Objects.requireNonNull(response2URL.split("\\?")[0]);
            Document responsePage2 = Jsoup.parse(response2.text());

            Element authStateElement = responsePage2.selectFirst("input[name=AuthState]");
            String authState = stripData(responsePage2, authStateElement, "value");

            // Step 3: POST username, password, and AuthState
            Map<String, String> form3Data = new HashMap<>();
            form3Data.put("username", username);
            form3Data.put("password", password);
            form3Data.put("AuthState", authState);

            var response3 = session.post(form2Url).headers(PreHeaders.H3(form2Url))
                    .formData(new FormData()
                            .add("username", username)
                            .add("password", password)
                            .add("AuthState", authState))
                    .execute();
            System.out.println("response3" + response3.statusCode());
            Document responsePage3 = Jsoup.parse(response3.text());

            if (responsePage3.text().contains("το όνομα χρήστη ή ο κωδικός πρόσβασης ήταν λάθος")) {
                var errorResult = new JSObject();
                errorResult.put("error", "Wrong password");
                return errorResult;
            }

            Element formElements3 = responsePage3.selectFirst("form[action]");
            String formUrl3 = stripData(responsePage3, formElements3, "action");

            formElements3 = responsePage3.selectFirst("input[name=SAMLResponse]");
            String samlResponse3 = stripData(responsePage3, formElements3, "value");

            formElements3 = responsePage3.selectFirst("input[name=RelayState]");
            String relayState3 = stripData(responsePage3, formElements3, "value");

            // Step 4: POST SAMLResponse and RelayState
            Map<String, String> form4Data = new HashMap<>();
            form4Data.put("SAMLResponse", samlResponse3);
            form4Data.put("RelayState", relayState3);

            var response4 = session.post(formUrl3).headers(PreHeaders.H4())
                    .body("SAMLResponse=" + URLEncoder.encode(samlResponse3, "utf-8") + "&RelayState=" + URLEncoder.encode(relayState3, "utf-8"), MediaType.parse("application/x-www-form-urlencoded"))
                    .allowRedirects(false)
                    .execute();
            String redirectUrl = response4.rawResponse().priorResponse().header("Location");

            if (!redirectUrl.contains("code=")) {
                var errorResult = new JSObject();
                errorResult.put("error", "The URL does not contain a code");
                return errorResult;
            }

            // Step 5: Exchange code for access_token
            String code = Objects.requireNonNull(redirectUrl.split("code=")[1]);

            Map<String, String> form5Data = new HashMap<>();
            form5Data.put("grant_type", "authorization_code");
            form5Data.put("code", code);
            form5Data.put("client_id", CLIENT_ID);
            form5Data.put("redirect_uri", CALLBACK_URL);
            form5Data.put("code_verifier", codeVerifier);

            var response5 = session.post(TOKEN_URL).headers(PreHeaders.H4())
                    .body(new FormBuilder()
                            .add("grant_type", "authorization_code")
                            .add("code", code)
                            .add("client_id", CLIENT_ID)
                            .add("redirect_uri", CALLBACK_URL)
                            .add("code_verifier", codeVerifier)
                            .build(), MediaType.parse("application/x-www-form-urlencoded"))
                    .execute();

            System.out.println("response5" + response5.statusCode());


            String tokenResponse = Objects.requireNonNull(response5.text());
            JSONObject jsonObject = new JSONObject(tokenResponse);
            String token = jsonObject.getString("access_token");
            var response = new JSObject();
            System.out.println(token);
            response.put("error", null);
            response.put("token", token);
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
