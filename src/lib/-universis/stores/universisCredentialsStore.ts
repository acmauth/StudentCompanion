import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore'

// Store for the user's credentials
export const userCreds = new CapacitorPersistedStore({
    username: "",
    password: "",
    token: ""
}, 'usercredentials')