import Foundation
import Capacitor
import Alamofire
import SwiftSoup

class UniversisScraperLogic {
    private static let AUTHORIZE_URL = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/auth"
    private static let CALLBACK_URL = "https://students.auth.gr/auth/callback/index.html"
    private static let TOKEN_URL = "https://oauth2.it.auth.gr/auth/realms/universis/protocol/openid-connect/token"
    private static let CLIENT_ID = "students"
    private static let SCOPE = "students"

    static func scrape(username: String, password: String) -> JSObject {
        let session = Session()

        do {
            // Step 1: Initial GET request
            let state = Data.generateRandomBytes(length: 8).base64EncodedString()
            let codeVerifier = Data.generateCodeVerifier()
            let codeChallenge = Data.generateCodeChallenge(codeVerifier: codeVerifier)

            // Setting the parameters
            var params = [
                "redirect_uri": CALLBACK_URL,
                "response_type": "code",
                "client_id": CLIENT_ID,
                "code_challenge": codeChallenge,
                "code_challenge_method": "S256",
                "scope": SCOPE,
                "state": state
            ]

            // Appending the parameters to the URL
            let extendedURL = AUTHORIZE_URL + "?" + Data.paramsToString(params: params)

            // Performing the request
            let response1 = try session.request(extendedURL, headers: PreHeaders.H1()).response()
            print("response1: \(response1)")

            let responsePage = try SwiftSoup.parse(response1.text)

            // Scraping for the form URL, SAMLRequest, RelayState
            guard let formElements = try responsePage.select("form[action]").first() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            let formUrl = try formElements.attr("action")

            guard let samlRequest = try responsePage.select("input[name=SAMLRequest]").first()?.val() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }

            guard let relayState = try responsePage.select("input[name=RelayState]").first()?.val() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }

            // Step 2: POST SAMLRequest and RelayState
            let formData2 = ["SAMLRequest": samlRequest, "RelayState": relayState]
            let response2 = try session.request(formUrl, method: .post, headers: PreHeaders.H2(), encodable: formData2).response()
            print("response2: \(response2)")

            guard let response2URL = response2.url else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            let form2Url = response2URL.absoluteString.split(separator: "?")[0]

            let responsePage2 = try SwiftSoup.parse(response2.text)

            guard let authStateElement = try responsePage2.select("input[name=AuthState]").first() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            let authState = try authStateElement.val()

            // Step 3: POST username, password, and AuthState
            let formData3 = ["username": username, "password": password, "AuthState": authState]
            let response3 = try session.request(form2Url, method: .post, headers: PreHeaders.H3(url: form2Url), encodable: formData3).response()
            print("response3: \(response3)")

            let responsePage3 = try SwiftSoup.parse(response3.text)

            if try responsePage3.text().contains("το όνομα χρήστη ή ο κωδικός πρόσβασης ήταν λάθος") {
                var errorResult = JSObject()
                errorResult["error"] = "Wrong password"
                return errorResult
            }

            guard let formElements3 = try responsePage3.select("form[action]").first() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            let formUrl3 = try formElements3.attr("action")

            guard let samlResponse3 = try responsePage3.select("input[name=SAMLResponse]").first()?.val() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }

            guard let relayState3 = try responsePage3.select("input[name=RelayState]").first()?.val() else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }

            // Step 4: POST SAMLResponse and RelayState
            let formData4 = ["SAMLResponse": samlResponse3, "RelayState": relayState3]
            let response4 = try session.request(formUrl3, method: .post, headers: PreHeaders.H4()).response()
            print("response4: \(response4)")

            guard let redirectUrl = response4.response?.allHeaderFields["Location"] as? String else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }

            if !redirectUrl.contains("code=") {
                var errorResult = JSObject()
                errorResult["error"] = "The URL does not contain a code"
                return errorResult
            }

            // Step 5: Exchange code for access_token
            let code = redirectUrl.components(separatedBy: "code=")[1]

            let formData5 = [
                "grant_type": "authorization_code",
                "code": code,
                "client_id": CLIENT_ID,
                "redirect_uri": CALLBACK_URL,
                "code_verifier": codeVerifier
            ]
            let response5 = try session.request(TOKEN_URL, method: .post, headers: PreHeaders.H4(), encodable: formData5).response()
            print("response5: \(response5)")

            guard let tokenResponse = response5.value as? String else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            let jsonObject = try JSONSerialization.jsonObject(with: tokenResponse.data(using: .utf8)!) as! [String: Any]
            guard let token = jsonObject["access_token"] as? String else {
                throw NSError(domain: "", code: 1, userInfo: nil)
            }
            var response = JSObject()
            print(token)
            response["error"] = nil
            response["token"] = token
            return response

        } catch {
            error.printStackTrace()
        }

        var response = JSObject()
        response["error"] = true
        response["reason"] = "error"
        return response
    }
}
