import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { url, method = 'get', data = null, params = null, headers, responseType } = config
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

        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }

            // 将header从一个字符串解析为一个object
            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData =
                responseType && responseType !== 'text' ? request.response : request.responseText
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }

            resolve(response)
        }
        request.send(data)
    })
}
