// Usage: import timeSinceDate from 'src/lib/globalFunctions/getTimeSinceDate'
// Description: Returns the time since a date in a human readable format - Greek
// Input: Date, language
// Output: String
export default function timeSinceDate(date:Date | String, lang:string) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
        let years = Math.floor(interval);
        if (lang === 'en') {
            return years + (years > 1 ? " years" : " year");
        }
        return years + (years > 1 ? " χρόνια" : " χρόνος");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let months = Math.floor(interval);
        if (lang === 'en') {
            return months + (months > 1 ? " months" : " month");
        }
        return months + (months > 1 ? " μήνες" : " μήνας");
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let days = Math.floor(interval);
        if (lang === 'en') {
            return days + (days > 1 ? " days" : " day");
        }
        return days + (days > 1 ? " μέρες" : " μέρα");
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let hours = Math.floor(interval);
        if (lang === 'en') {
            return hours + (hours > 1 ? " hours" : " hour");
        }
        return hours + (hours > 1 ? " ώρες" : " ώρα");
    }
    interval = seconds / 60;
    if (interval > 1) {
        let minutes = Math.floor(interval);
        if (lang === 'en') {
            return minutes + (minutes > 1 ? " minutes" : " minute");
        }
        return minutes + (minutes > 1 ? " λεπτά" : " λεπτό");
    }
    seconds = Math.floor(seconds);
    if (lang === 'en') {
        return seconds + (seconds > 1 ? " seconds" : " second");
    }
    return seconds + (seconds > 1 ? " δευτερόλεπτα" : " δευτερόλεπτο");
}
