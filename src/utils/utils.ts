export function toMyDateFormat(d : Date) {
    return ''+ d.getFullYear() + '-' +
    ('0'+(d.getMonth()+1)).slice(-2) + '-' +
    ('0'+d.getDate()).slice(-2);
}
