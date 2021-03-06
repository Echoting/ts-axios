import axios from '../../src/index'

axios({
    method: 'get',
    url: '/base/get',
    params: {
        a: 1,
        b: 2
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: ['bar', 'baz']
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: {
            bar: 'baz'
        }
    }
})

const date = new Date()
axios({
    method: 'get',
    url: '/base/get',
    params: {
        date
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: '@:$, '
    }
})

axios({
    method: 'get',
    url: '/base/get',
    params: {
        foo: 'bar',
        baz: null
    }
})

axios({
    method: 'get',
    url: '/base/get#hash',
    params: {
        foo: 'bar'
    }
})

axios({
    method: 'get',
    url: '/base/get?foo=bar',
    params: {
        bar: 'baz'
    }
})

axios({
    method: 'post',
    url: '/base/post',
    responseType: 'json',
    data: {
        name: 'zhuting'
    }
}).then((res) => {
    console.log(res)
})

const arr = new Int32Array([21, 31])

axios({
    method: 'post',
    url: '/base/buffer',
    data: arr
})

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
axios({
    method: 'post',
    url: '/base/post',
    data: searchParams
})
