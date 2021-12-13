import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config).then(response => transformResponseData(response))
}

function processConfig(config: AxiosRequestConfig): void {
    config.url = transformUrl(config)

    // 默认配置中已经做了transformHeaders
    config.data = transform(config.data, config.headers, config.transformRequest)

    // 由于给default config做了merge，headers需要重新处理一下
    config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
    const { url, params, paramsSerializer } = config
    return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(response: AxiosResponse): AxiosResponse {
    response.data = transform(response.data, response.headers, response.config.transformResponse)
    return response
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}

export default dispatchRequest
