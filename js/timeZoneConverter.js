// timeZoneConverter.js

function convertTimestampToDate(timestamp, timeZone) {
    const date = new Date(timestamp * 1000);
    const options = {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return new Intl.DateTimeFormat([], options).format(date);
}
