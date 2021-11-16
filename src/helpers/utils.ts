const toString = Object.prototype.toString

export function isDate(value: any): value is Date {
    return toString.call(value) === '[object Date]'
}

export function isPlainObject(value: any): value is Object {
    return toString.call(value) === '[object Object]'
}
