<script>
    import { onMount } from "svelte";
    import { universisGet } from "$lib/dataService";
    import { get } from "svelte/store";
    import { elearningGet } from "$lib/dataService";
    import UserInfoStore from "../../stores/userinfo.store";

    let username = "";

    // @ts-ignore
    /**
	 * @type {any[]}
	 */
    let messages = []
    
    async function fetchMessages() {
        const body = [
            {
                "index": 0,
                "methodname": "core_message_get_messages",
                "args": {
                    "useridto": get(UserInfoStore).userId,
                    "useridfrom": "0",
                    "type": "notifications",
                    "newestfirst": 1,
                    "read": 1,
                    "limitfrom": 0,
                    "limitnum": 21
                }
            }
        ];
        
        const response = elearningGet(body)

        const data = await response;
        return data;
    }



    onMount(async () => {
        let personalData = await universisGet("users/me");
        // let recentCourses = await universisGet('students/me/grades?$filter=courseExam/year eq 2022 and courseExam/examPeriod eq 5&$expand=status,course($expand=gradeScale,locale),courseClass($expand=instructors($expand=instructor($select=InstructorSummary))),courseExam($expand=examPeriod,year)&$top=-1&$count=false');
        // console.log(recentCourses.value);
        // console.log(await universisGet("students/me"))
        // console.log(await universisGet("students/me/department?$expand=departmentConfiguration($expand=examYear,examPeriod($expand=name))&$top=1&$skip=0&$count=false"))
        username = personalData.name;


        const response = await fetchMessages();
        console.log(response);
        if (response) {
            messages = response.data.messages;
        } else {
            messages = [{smallmessage: "No messages found"}]
        }
    });
    
</script>


<p>Hello {username}</p>

{#each messages as message}
    <p>{message.subject}</p>
{/each}
