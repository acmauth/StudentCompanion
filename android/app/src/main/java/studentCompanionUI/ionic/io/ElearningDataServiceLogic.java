package studentCompanionUI.ionic.io;
import com.getcapacitor.JSObject;
import com.github.fracpete.requests4j.Requests;
import java.net.CookieManager;
import java.net.HttpCookie;
import java.net.URI;
import okhttp3.MediaType;

// This class is responsible for making requests to the elearning platform
// It is called from the ElearningDataService plugin
public class ElearningDataServiceLogic {

    // Method to get data from the elearning platform
    public static JSObject get(String sesskey, String moodleSession, String dataArguments) {

        try {

            // For the request to be successful, we need to add the MoodleSession cookie to the request
            var cookieMan = new CookieManager();
            var cookieStore = cookieMan.getCookieStore();
            var uri = new URI("https://elearning.auth.gr/lib/ajax/service.php");
            var cookie = new HttpCookie("MoodleSession", moodleSession);
            cookieStore.add(uri, cookie);
            
            // Make the request as a post request, arguments are JSON
            var request = Requests.post("https://elearning.auth.gr/lib/ajax/service.php?sesskey="+sesskey)
                    .body(dataArguments, MediaType.parse("application/json"))
                    .cookies(cookieMan)
                    .execute();

            System.out.println(request.text());

            var response = new JSObject();
            response.put("error", null)
                    .put("data", request.text());
            return response;
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        var response = new JSObject();
        response.put("error", true);
        response.put("reason", "error");
        return response;
    }


}
