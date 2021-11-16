import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
    const { url, method = 'get', data = null, params = null, headers } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url, true)

    Object.keys(headers).forEach(headerName => {
        // 如果data为null，就不需要设置content-type了 没有意义
        if (data === null && headerName.toLowerCase() === 'content-type') {
            delete headers[name]
        } else {
            request.setRequestHeader(headerName, headers[headerName])
        }
    })
    request.send(data)
}
