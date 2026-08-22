import { initAvatar } from "./initAvatar";

export default async function hooks() {
    const hooks = [initAvatar];
    const results = await Promise.allSettled(hooks.map(fun => fun()));

    results.forEach((result, i) => {
        if (result.status === 'rejected')
            console.error(`Login hook ${hooks[i].name} failed:`, result.reason);
    });

    return results;
}
