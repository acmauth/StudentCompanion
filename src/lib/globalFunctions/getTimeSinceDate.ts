// Usage: import timeSinceDate from 'src/lib/globalFunctions/getTimeSinceDate'
// Description: Returns the time since a date in a human readable format - Greek
// Input: Date
// Output: String
export default function timeSinceDate(date:Date){
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
        let years = Math.floor(interval);
        return years + (years > 1 ? " χρόνια" : " χρόνος");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        let months = Math.floor(interval);
        return months + (months > 1 ? " μήνες" : " μήνας");
    }
    interval = seconds / 86400;
    if (interval > 1) {
        let days = Math.floor(interval);
        return days + (days > 1 ? " μέρες" : " μέρα");
    }
    interval = seconds / 3600;
    if (interval > 1) {
        let hours = Math.floor(interval);
        return hours + (hours > 1 ? " ώρες" : " ώρα");
    }
    interval = seconds / 60;
    if (interval > 1) {
        let minutes = Math.floor(interval);
        return minutes + (minutes > 1 ? " λεπτά" : " λεπτό");
    }
    seconds = Math.floor(seconds);
    return seconds + (seconds > 1 ? " δευτερόλεπτα" : " δευτερόλεπτο");
}
