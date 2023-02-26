export const dateFormat = (item) => {

    const lang = navigator.language;
    const rtf = new Intl.RelativeTimeFormat( lang, { numeric: 'auto' });

    const dateSecDelta = Math.round((new Date(item.createDate).getTime() - Date.now())/1000) ;

    const secondTimeMarkers = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

    const literalTimeMarkers = ['second','minute', 'hour', 'day', 'week', 'month' ,'year'];

    const indexTime = secondTimeMarkers.findIndex(time => time > Math.abs(dateSecDelta))

    const divisor = indexTime ? secondTimeMarkers[indexTime - 1] : 1 //for seconds if index 0 then seconds 

    const time = rtf.format(Math.floor(dateSecDelta/divisor),literalTimeMarkers[indexTime])

    return time;
}  


   