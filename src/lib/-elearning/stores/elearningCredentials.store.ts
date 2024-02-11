import { persisted } from 'svelte-persisted-store'

// Store for the user's credentials
export const elearningCredentials = persisted('elearningCredentials', {
    username: "",
    password: "",
    sesskey: "",
    userID: "",
    moodleSession: ""
})