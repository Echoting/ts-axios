import { AxiosInstance } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'

// 创建一个axios混合对象，可以直接使用axios() 调用，axios.request() 等等
function createInstance(): AxiosInstance {
    const context = new Axios()
    const instance = Axios.prototype.request.bind(context)
    extend(instance, context)
    return instance as AxiosInstance
}

const axios = createInstance()

export default axios
