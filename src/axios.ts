import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

import defaults from './defaults'

// 创建一个axios混合对象，可以直接使用axios() 调用，axios.request() 等等
function createInstance(config: AxiosRequestConfig): AxiosInstance {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosInstance
}

const axios = createInstance(defaults)

export default axios
