import { deepMerge, isPlainObject } from './utils'
import { Method } from '../types'

function normalizeHeaderName(header: any, normalizeName: string): void {
    if (!header) {
        return
    }

    Object.keys(header).forEach(name => {
        if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            header[normalizeName] = header[name]
            delete header[name]
        }
    })
}

export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')

    if (isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }

    return headers
}

export function parseHeaders(headers: string): any {
    let parsed: any = {}
    if (!headers) {
        return
    }

    headers.split('\r\n').forEach(line => {
        let [key, value] = line.split(':')
        key = key.trim().toLowerCase()
        if (!key) {
            return
        }
        if (value) {
            value = value.trim()
        }
        parsed[key] = value
    })

    return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers
    }

    headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

    methodsToDelete.forEach(method => {
        delete headers[method]
    })

    return headers
}
