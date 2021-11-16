import { isDate, isObject } from './utils'

// 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode
function encode(value: string): string {
    return encodeURIComponent(value)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: ['bar', 'baz']
//     }
// })
// 如果params是数组，最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'
// params: {a: 1, b: 2} 最终请求的 url 是 /base/get?a=1&b=2
// params: {foo: {bar: 'baz'}} 最终请求的 url 是 /base/get?foo=%7B%22bar%22:%22baz%22%7D，foo 后面拼接的是 {"bar":"baz"} encode 后的结果。
// params为Date 最终请求的 url 是 /base/get?date=2019-04-01T05:55:39.030Z
// 对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的。
// 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode。
export function buildURL(url: string, params?: any): string {
    if (!params) {
        return url
    }

    const parts: string[] = []

    Object.keys(params).forEach(key => {
        let value = params[key]

        let buildValue: string[] = []

        if (value === null || typeof value === 'undefined') {
            return
        }

        if (Array.isArray(value)) {
            buildValue = value
            key += '[]'
        } else {
            buildValue = [value]
        }

        buildValue.forEach(valItem => {
            if (isDate(valItem)) {
                valItem = valItem.toISOString()
            } else if (isObject(value)) {
                valItem = JSON.stringify(valItem)
            }

            parts.push(`${encode(key)}=${encode(valItem)}`)
        })
    })

    const partsStr = parts.join('&')
    if (partsStr) {
        if (url.indexOf('#') !== -1) {
            url = url.split('#')[0]
        }

        url = url.indexOf('?') !== -1 ? url + '&' + partsStr : url + '?' + partsStr
    }

    return url
}
