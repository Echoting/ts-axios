import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            url,
            method = 'get',
            data = null,
            params = null,
            headers,
            responseType,
            timeout
        } = config
        const request = new XMLHttpRequest()
        request.open(method.toUpperCase(), url!, true)

        Object.keys(headers).forEach(headerName => {
            // 如果data为null，就不需要设置content-type了 没有意义
            if (data === null && headerName.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(headerName, headers[headerName])
            }
        })

        if (timeout) {
            request.timeout = timeout
        }

        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }

            if (request.status === 0) {
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

            handleResponse(response)
        }

        request.onerror = () => {
            reject(createError('Network Error', config, null, request))
        }

        request.ontimeout = () => {
            reject(
                createError(
                    `Timeout of ${config.timeout} ms exceeded`,
                    config,
                    'ECONNABORTED',
                    request
                )
            )
        }

        function handleResponse(response: AxiosResponse) {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else {
                reject(
                    createError(
                        `Request failed with status code ${response.status}`,
                        config,
                        null,
                        request,
                        response
                    )
                )
            }
        }

        request.send(data)
    })
}
