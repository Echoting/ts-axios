import { isPlainObject } from './utils'

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
