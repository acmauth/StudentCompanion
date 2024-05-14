import Capacitor

@objc(UniversisPlugin)
public class UniversisPlugin: CAPPlugin {
    @objc func authenticate(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        print("Chris")
        call.resolve(["value": value])
    }
}
