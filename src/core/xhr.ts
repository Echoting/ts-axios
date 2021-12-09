import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            url,
            method = 'get',
            data = null,
            params = null,
            headers,
            responseType,
            timeout,
            cancelToken,
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName
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

        // 设置跨域携带cookie
        if (withCredentials) {
            request.withCredentials = withCredentials
        }

        // xsrf防御
        // xsrf防御方法：每次访问站点的时候，服务端通过set-cookie 的方式将token种到客户端
        // 然后客户端发送请求的时候，从 cookie 中对应的字段读取出 token，然后添加到请求 headers 中
        // 这样服务端就可以拿到这个token验证
        if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
            const xsrfCookieValue = cookie.read(xsrfCookieName)
            if (xsrfCookieValue) {
                headers[xsrfHeaderName!] = xsrfCookieValue
            }
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

        // 取消功能
        if (cancelToken) {
            cancelToken.promise.then(reason => {
                request.abort()
                reject(reason)
            })
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
