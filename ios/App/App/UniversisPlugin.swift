import Capacitor

@objc(UniversisPlugin)
public class UniversisPlugin: CAPPlugin {
    @objc func authenticate(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print("Chris")
        let credentials = UniversisScraperLogic.scrape(username: call.getString("username") ?? "", password: call.getString("password") ?? "")
        
        call.resolve(["value": credentials])
    }
}
