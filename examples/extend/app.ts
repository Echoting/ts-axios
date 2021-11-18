import axios from '../../src/index'

interface ResponseUser<T = any> {
    code: number
    message: string
    result: T
}

interface User {
    name: string,
    age: number
}

axios({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hi'
    }
})

axios('/extend/post', {
    method: 'post',
    data: {
        msg: 'hello'
    }
})

axios.request({
    url: '/extend/post',
    method: 'post',
    data: {
        msg: 'hello'
    }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' }).then(res => {
    console.log(888, res)
})

function getUser<T>() {
    return axios.get<ResponseUser<User>>('/extend/user')
        .then(res => res.data)
        .catch(error => console.error(error))
}

// 增加接口泛型
async function test() {
    const user = await getUser<User>()
    if (user) {
        console.log(777, user.result.age)
    }
}

test()
