// 全局axios默认值

import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    timeout: 0,

    method: 'get'
}

const methodsNoData = ['delete', 'get', 'head', 'options']

methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults
