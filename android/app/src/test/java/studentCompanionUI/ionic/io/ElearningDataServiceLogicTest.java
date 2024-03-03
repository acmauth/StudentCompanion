package studentCompanionUI.ionic.io;
import static studentCompanionUI.ionic.io.ElearningDataServiceLogic.get;

import com.getcapacitor.JSObject;

import junit.framework.TestCase;

public class ElearningDataServiceLogicTest extends TestCase {

    public void testGet() {
        // {"credentials":{"sesskey":"PCteGlGuIT","moodleSession":"v2jedqrutf70gdrtjg99085bup","userID":"146589"}}
        // {"credentials":{"sesskey":"x6vjjM7uMG","moodleSession":"j7ih56gmbghvf8vd4dvkfna601","userID":"146589"}}
        // {"url":"https:\/\/elearning.auth.gr\/lib\/ajax\/service.php?sesskey=x6vjjM7uMG","method":"POST","data":"[{\"index\":0,\"methodname\":\"core_message_get_messages\",\"args\":{\"useridto\":\"146589\",\"useridfrom\":\"0\",\"type\":\"notifications\",\"newestfirst\":1,\"read\":1,\"limitfrom\":0,\"limitnum\":21}}]","dataType":"json","headers":{"content-type":"text\/plain;charset=UTF-8"}}
        // [{"index":0,"methodname":"core_message_get_messages","args":{"useridto":"146589","useridfrom":"0","type":"notifications","newestfirst":1,"read":1,"limitfrom":0,"limitnum":21}}]
        var data = "[{\"index\":0,\"methodname\":\"core_message_get_messages\",\"args\":{\"useridto\":\"146589\",\"useridfrom\":\"0\",\"type\":\"notifications\",\"newestfirst\":1,\"read\":1,\"limitfrom\":0,\"limitnum\":21}}]";
        JSObject result;
        result = get("yI5YKFg6W3","v2jedqrutf70gdrtjg99085bup",data);
        System.out.println(result);

    }
}