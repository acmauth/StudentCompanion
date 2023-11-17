import { persisted } from 'svelte-persisted-store'

interface UserInfo {
    userId: string;
    valid: boolean;
}

// Store for the user's credentials
const userInfoStore = persisted<UserInfo>("userInfo", {
  userId: '146589',
  valid: true
});

export default userInfoStore;
