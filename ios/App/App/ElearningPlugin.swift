import Capacitor

@objc(ElearningPlugin)
public class ElearningPlugin: CAPPlugin {
    @objc func authenticate(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print("Neron")
        call.resolve(["value": value])
    }
    
    @objc func apiGet(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print("Michalis!!")
        call.resolve(["value": value])
    }
}
