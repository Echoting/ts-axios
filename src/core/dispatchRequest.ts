import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    processConfig(config)
    return xhr(config).then(response => transformResponseData(response))
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformUrl(config)
    config.headers = transformHeaders(config)
    config.data = transformRequestData(config)

    // 由于给default config做了merge，headers需要重新处理一下
    config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): string {
    const { data } = config
    return transformRequest(data)
}

function transformResponseData(response: AxiosResponse): AxiosResponse {
    const { data } = response
    response.data = transformResponse(data)
    return response
}

function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

export default dispatchRequest
