import CapacitorPersistedStore from '$lib/storage/capacitorPersistedStore'

// Store for the user's credentials
export const elearningCredentials = new CapacitorPersistedStore({
    username: "",
    password: "",
    sesskey: "",
    userID: "",
    moodleSession: ""
}, 'elearningCredentials')