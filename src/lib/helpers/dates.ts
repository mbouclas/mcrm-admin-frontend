export function formatDate(dateStr: string, format: string = 'DD/MM/YYYY @ HH:mm'): string {
    const date = new Date(dateStr);
    // format a date based on a format string
    // https://stackoverflow.com/a/3552493/319711
const map: any = {
    'M': date.getMonth() + 1, // month
    'D': date.getDate(), // day
    'H': date.getHours(), // hour
    'm': date.getMinutes(), // minute
    's': date.getSeconds(), // second
    'Y': date.getFullYear(), // year
    'y': date.getFullYear().toString().substr(-2), // year
    'Z': date.getMilliseconds() // milliseconds
};

return format.replace(/(M+|D+|H+|m+|s+|Y+|y+|Z+)/g, function (v: string) {
    return ((v.length > 1 ? '0' : '') + map[v.slice(-1)]).slice(-2);
});
}
