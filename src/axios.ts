import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

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

export default axios
