import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

import CancelToken from './cancel/cancelToken'
import Cancel, { isCancel } from './cancel/cancel'

// 创建一个axios混合对象，可以直接使用axios() 调用，axios.request() 等等
function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config))
}

axios.all = function all(promises) {
    return Promise.all(promises)
}
axios.spread = function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr)
    }
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
