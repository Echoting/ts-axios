const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const cookieParser = require('cookie-parser')
const multipart = require('connect-multiparty')
const atob = require('atob')

// require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))
app.use(express.static(__dirname, {
    setHeaders (res) {
        res.cookie('XSRF-TOKEN-D', '1234abc')
    }
}))

app.use(multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
}))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


const port = process.env.PORT || 1212
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

const router = express.Router()

handleSimpleRouter()
handleBaseRouter()
handleErrorRouter()
handleExtendRouter()
handelInterceptorRouter()
handelConfigRouter()
handleCancelRouter()
handleMoreRouter()

app.use(router)

function handleSimpleRouter() {
    router.get('/simple/get', function(req, res) {
        res.json({
            msg: `hello world`
        })
    })
}

function handleBaseRouter() {
    router.get('/base/get', function(req, res) {
        res.json(req.query)
    })

    router.post('/base/post', function(req, res) {
        res.json(req.body)
    })

    router.post('/base/buffer', function(req, res) {
        let msg = []
        req.on('data', (chunk) => {
            if (chunk) {
                msg.push(chunk)
            }
        })
        req.on('end', () => {
            let buf = Buffer.concat(msg)
            res.json(buf.toJSON())
        })
    })
}

function handleErrorRouter() {
    router.get('/error/get', function(req, res) {
        if (Math.random() > 0.5) {
            res.json({
                msg: `hello world`
            })
        } else {
            res.status(500)
            res.end()
        }
    })

    router.get('/error/timeout', function(req, res) {
        setTimeout(() => {
            res.json({
                msg: `hello world`
            })
        }, 3000)
    })
}

function handleExtendRouter() {
    router.post('/extend/post', function(req, res) {
        res.json(req.body)
    })

    router.get('/extend/get', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.options('/extend/options', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.delete('/extend/delete', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.head('/extend/head', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.put('/extend/put', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })

    router.patch('/extend/patch', function(req, res) {
        res.json(req.body)
    })

    router.get('/extend/user', function(req, res) {
        res.json({
            code: 0,
            message: 'ok',
            result: {
                name: 'zhuting',
                age: 18
            }
        })
    })

}

function handelInterceptorRouter() {
    router.get('/interceptor/get', function(req, res) {
        res.json({
            msg: 'hello world'
        })
    })
}

function handelConfigRouter() {
    router.post('/config/post', function(req, res) {
        res.json(req.body)
    })
}

function handleCancelRouter() {
    router.get('/cancel/get', function (req, res) {
        setTimeout(() => {
            res.json(req.body)
        }, 1000)
    })

    router.post('/cancel/post', function (req, res) {
        setTimeout(() => {
            res.json(req.body)
        }, 1000)
    })
}

function handleMoreRouter() {
    router.get('/more/get', function (req, res) {
        res.json(req.cookies)
    })

    router.post('/more/upload', function(req, res) {
        console.log(req.body, req.files)
        res.end('upload success!')
    })

    router.post('/more/post', function(req, res) {
        const auth = req.headers.authorization
        const [type, credentials] = auth.split(' ')
        console.log(124, auth.split(' '))
        console.log(atob(credentials))
        const [username, password] = atob(credentials).split(':')
        if (type === 'Basic' && username === 'Yee' && password === '123456') {
            res.json(req.body)
        } else {
            res.end('UnAuthorization')
        }
    })

    router.get('/more/304', function(req, res) {
        res.status(304)
        res.json({
            status: 'ok'
        })
    })

    router.get('/more/A', function(req, res) {
        res.json({
            status: 'ok'
        })
    })

    router.get('/more/B', function(req, res) {
        res.json({
            status: 'ok'
        })
    })
}
