import { isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
    protocol: string
    host: string
}

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
export function buildURL(
    url: string,
    params?: any,
    paramsSerializer?: (params: any) => void
): string {
    if (!params) {
        return url
    }

    let serializedParams
    if (paramsSerializer) {
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString()
    } else {
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
                } else if (isPlainObject(value)) {
                    valItem = JSON.stringify(valItem)
                }

                parts.push(`${encode(key)}=${encode(valItem)}`)
            })
        })

        serializedParams = parts.join('&')
    }

    if (serializedParams) {
        if (url.indexOf('#') !== -1) {
            url = url.split('#')[0]
        }

        url = url.indexOf('?') !== -1 ? url + '&' + serializedParams : url + '?' + serializedParams
    }

    return url
}

// 判断是否是一个同源的url
// 通过创建一个a标签，拿到协议和域名
export function isURLSameOrigin(requesetURL: string): boolean {
    const currentUrl = resolveURL(window.location.href)
    const parsingUrl = resolveURL(requesetURL)

    return currentUrl.protocol === parsingUrl.protocol && currentUrl.host === parsingUrl.host

    function resolveURL(url: string): URLOrigin {
        const urlNode = document.createElement('a')
        urlNode.setAttribute('href', url)

        const { host, protocol } = urlNode
        return {
            host,
            protocol
        }
    }
}
