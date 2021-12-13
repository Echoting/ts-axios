const toString = Object.prototype.toString

export function isDate(value: any): value is Date {
    return toString.call(value) === '[object Date]'
}

export function isPlainObject(value: any): value is Object {
    return toString.call(value) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
    for (const key in from) {
        ;(to as T & U)[key] = from[key] as any
    }
    return to as T & U
}

export function deepMerge(...objs: any[]): any {
    const result = Object.create(null)

    objs.forEach(obj => {
        if (obj) {
            Object.keys(obj).forEach(key => {
                const value = obj[key]
                if (isPlainObject(value)) {
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(value, result[key])
                    } else {
                        result[key] = deepMerge(value)
                    }
                } else {
                    result[key] = value
                }
            })
        }
    })

    return result
}

export function isFormData(val: any): boolean {
    return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}
