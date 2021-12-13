import {
    AxiosRequestConfig,
    AxiosPromise,
    Method,
    ResolveFn,
    RejectFn,
    AxiosResponse
} from '../types'
import dispatchRequest, { transformUrl } from '../core/dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

interface InterceptorPromiseChain {
    resolve: ResolveFn | ((config: AxiosRequestConfig) => AxiosPromise)
    reject?: RejectFn
}

export default class Axios {
    defaults: AxiosRequestConfig
    interceptors: Interceptors

    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    // 接口重载
    // 支持 axios(config) 或者 axios(url, config)
    request(urlOrConfig: any, config?: any): AxiosPromise {
        // 说明传入了url
        if (typeof urlOrConfig === 'string') {
            if (!config) {
                config = {}
            }
            config.url = urlOrConfig
        } else {
            config = mergeConfig(this.defaults, urlOrConfig)
        }

        let chain: InterceptorPromiseChain[] = [
            {
                resolve: dispatchRequest,
                // resolve: () => {
                //     let test = dispatchRequest(config as AxiosRequestConfig)
                //     test.then(res => {
                //         console.log(123, res)
                //         return res
                //     })
                //     return test
                // },
                reject: undefined
            }
        ]

        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })

        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })

        let promise = Promise.resolve(config)

        while (chain.length > 0) {
            const { resolve, reject } = chain.shift()!

            promise = promise.then(resolve, reject)
        }

        return promise
        // return dispatchRequest(config as AxiosRequestConfig)
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get', url, config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('post', url, data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }

    getUri(config?: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config)
        return transformUrl(config)
    }

    _requestMethodWithoutData(
        method: Method,
        url: string,
        config?: AxiosRequestConfig
    ): AxiosPromise {
        return this.request(
            Object.assign(config || {}, {
                method,
                url
            })
        )
    }

    _requestMethodWithData(
        method: Method,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): AxiosPromise {
        return this.request(
            Object.assign(config || {}, {
                method,
                url,
                data
            })
        )
    }
}
