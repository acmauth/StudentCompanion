package studentCompanionUI.ionic.io;

import java.util.HashMap;
import java.util.Map;

public class PreHeaders {

    public static Map<String, String> H1() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        headers.put("Accept-Language", "en-US,en;q=0.9,el-GR;q=0.8,el;q=0.7");
        headers.put("Connection", "keep-alive");
        headers.put("Host", "oauth2.it.auth.gr");
        headers.put("Referer", "https://students.auth.gr/");
        headers.put("Upgrade-Insecure-Request", "1");
        headers.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64; rv:41.0) Gecko/20100101 Firefox/41.0");
        return headers;
    }

    public static Map<String, String> H2() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        headers.put("Accept-Language", "en-US,en;q=0.9");
        headers.put("Connection", "keep-alive");
        headers.put("Content-Type", "application/x-www-form-urlencoded");
        headers.put("Host", "login.auth.gr");
        headers.put("Origin", "https://oauth2.it.auth.gr");
        headers.put("Referer", "https://oauth2.it.auth.gr/");
        headers.put("Sec-Fetch-Dest", "document");
        headers.put("Sec-Fetch-Mode", "navigate");
        headers.put("Sec-Fetch-Site", "same-origin");
        headers.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64; rv:41.0) Gecko/20100101 Firefox/41.0");
        return headers;
    }

    public static Map<String, String> H3(String param1) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        headers.put("Accept-Language", "en-US,en;q=0.9");
        headers.put("Connection", "keep-alive");
        headers.put("Content-Type", "application/x-www-form-urlencoded");
        headers.put("Host", "login.auth.gr");
        headers.put("Origin", "https://login.auth.gr");
        headers.put("Referer", param1);
        headers.put("Sec-Fetch-Dest", "document");
        headers.put("Sec-Fetch-Mode", "navigate");
        headers.put("Sec-Fetch-Site", "same-origin");
        headers.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64; rv:41.0) Gecko/20100101 Firefox/41.0");
        return headers;
    }

    public static Map<String, String> H4() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        headers.put("Accept-Language", "en-US,en;q=0.9");
        headers.put("Connection", "keep-alive");
        headers.put("Content-Type", "application/x-www-form-urlencoded");
        headers.put("Host", "oauth2.it.auth.gr");
        headers.put("Origin", "https://login.auth.gr");
        headers.put("Referer", "https://login.auth.gr/");
        headers.put("Sec-Fetch-Dest", "document");
        headers.put("Sec-Fetch-Mode", "navigate");
        headers.put("Sec-Fetch-Site", "same-origin");
        headers.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64; rv:41.0) Gecko/20100101 Firefox/41.0");
        return headers;
    }

    public static Map<String, String> H5() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Accept", "application/json, text/plain, */*");
        headers.put("Accept-Language", "en-US,en;q=0.9");
        headers.put("Cache-Control", "max-age=0");
        headers.put("Connection", "keep-alive");
        headers.put("Content-Type", "application/x-www-form-urlencoded");
        headers.put("Origin", "https://students.auth.gr");
        headers.put("Referer", "https://students.auth.gr/");
        headers.put("Sec-Fetch-Dest", "empty");
        headers.put("Sec-Fetch-Mode", "cors");
        headers.put("Sec-Fetch-Site", "same-site");
        headers.put("Sec-Fetch-User", "?1");
        headers.put("Upgrade-Insecure-Requests", "1");
        headers.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux i686 on x86_64; rv:41.0) Gecko/20100101 Firefox/41.0");
        return headers;
    }
}