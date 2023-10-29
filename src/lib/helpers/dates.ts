import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'; // Required for 'week' unit
import isLeapYear from 'dayjs/plugin/isLeapYear'; // Useful to determine if it's a leap year for quarter calculations

dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);

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

export function datePresets() {
    {
        const today = dayjs();
        const yesterday = today.subtract(1, 'day');
        const startOfWeek = today.startOf('week');
        const startOfMonth = today.startOf('month');
        const startOfYear = today.startOf('year');
        const endOfLastWeek = startOfWeek.subtract(1, 'day');
        const startOfLastWeek = endOfLastWeek.startOf('week');
        const endOfLastMonth = startOfMonth.subtract(1, 'day');
        const startOfLastMonth = endOfLastMonth.startOf('month');

        // Calculate start of quarter
        let startOfQuarter;
        if (today.isBefore(startOfYear.add(3, 'month'))) {
            startOfQuarter = startOfYear;
        } else if (today.isBefore(startOfYear.add(6, 'month'))) {
            startOfQuarter = startOfYear.add(3, 'month');
        } else if (today.isBefore(startOfYear.add(9, 'month'))) {
            startOfQuarter = startOfYear.add(6, 'month');
        } else {
            startOfQuarter = startOfYear.add(9, 'month');
        }

        return {
            today: {
                from: today.format('YYYY-MM-DD'),
                to: today.format('YYYY-MM-DD')
            },
            yesterday: {
                from: yesterday.format('YYYY-MM-DD'),
                to: yesterday.format('YYYY-MM-DD')
            },
            lastWeek: {
                from: startOfLastWeek.format('YYYY-MM-DD'),
                to: endOfLastWeek.format('YYYY-MM-DD')
            },
            lastMonth: {
                from: startOfLastMonth.format('YYYY-MM-DD'),
                to: endOfLastMonth.format('YYYY-MM-DD')
            },
            weekToDate: {
                from: startOfWeek.format('YYYY-MM-DD'),
                to: today.format('YYYY-MM-DD')
            },
            monthToDate: {
                from: startOfMonth.format('YYYY-MM-DD'),
                to: today.format('YYYY-MM-DD')
            },
            quarterToDate: {
                from: startOfQuarter.format('YYYY-MM-DD'),
                to: today.format('YYYY-MM-DD')
            },
            yearToDate: {
                from: startOfYear.format('YYYY-MM-DD'),
                to: today.format('YYYY-MM-DD')
            }
        };
    }
}

export const getDatesBetween = (from: string, to: string): string[] => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const dates: string[] = [];

    while(fromDate <= toDate) {
        dates.push(fromDate.toISOString().slice(0, 10));
        fromDate.setDate(fromDate.getDate() + 1);
    }

    return dates;
}

export function dateFormat(date: string, format: string = 'DD/MM/YYYY @ HH:mm'): string {
    const obj = dayjs(date);
    return obj.format(format);
}
