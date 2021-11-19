import axios from '../../src/index'

axios.interceptors.request.use(config => {
    config.headers.test += '11'
    return config
})

axios.interceptors.request.use(config => {
    config.headers.test += '22'
    return config
})

axios.interceptors.request.use(config => {
    config.headers.test += '33'
    return config
})

axios.interceptors.response.use(res => {
    res.data.msg += 'A'
    return res
})

const testInterceptor = axios.interceptors.response.use(res => {
    res.data.msg += 'B'
    return res
})

axios.interceptors.response.use(res => {
    res.data.msg += 'C'
    return res
})

axios.interceptors.response.eject(testInterceptor)

axios({
    method: 'get',
    url: '/interceptor/get',
    headers: {
        test: ''
    },
    params: {
        a: 1,
        b: 2
    }
}).then(res => {
    console.log(999, res)
})
