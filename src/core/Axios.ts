import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import dispatchRequest from '../core/dispatchRequest'

export default class Axios {
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
            config = urlOrConfig
        }
        return dispatchRequest(config as AxiosRequestConfig)
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
