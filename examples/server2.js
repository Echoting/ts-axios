const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const router = express.Router()

const cors = {
    'Access-Control-Allow-Origin': 'http://localhost:1212',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}

router.post('/more/server2', function(req, res) {
    res.set(cors)
    console.log(333, req.cookies.c)
    res.json(req.cookies)
})

// 对于跨域请求 会先发一个options请求，再发自己的
router.options('/more/server2', function(req, res) {
    res.set(cors)
    res.end()
})

app.use(router)

const port = 1616
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
