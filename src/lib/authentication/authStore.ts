import { persisted } from 'svelte-persisted-store'

// Store for the user's credentials
export const userCreds = persisted('usercredentials', {
    username: "",
    password: "",
    token: ""
})