const express = require('express')
const axios = require('axios')
const queryString = require('query-string')
const port = process.env.PORT || 8888

const clientId = '7e110ff6371f99282d05'
const clientSecret = 'c5f14b040ef65364d5ddb7d3b5631bcc705b59cf'

const app = express()
app.use(express.static(__dirname + '/public'))

let token = ''

app.get('/test', (req, res) => {
    res.send("hello from get")
})

app.post('/test', (req, res) => {
    if (token) {
        res.send('authenticated')
    } else {
        res.send('please sign in')
    }
})

app.get('/auth/github', (req, res) => {
    console.log('auth called')
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:${port}/auth/github/callback`
    res.statusCode = 302
    res.setHeader('location', url)
    res.end()
})

app.get('/auth/github/callback', (req, res) => {
    console.log('callback called')
    const code = req.query.code;
    axios({
        method: 'POST',
        url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`
    }).then((response) => {
        const parsed = queryString.parse(response.data)
        const accessToken = parsed.access_token
        token = accessToken
        console.log(token)
        res.redirect('/')
    })
})

app.listen(port, () => console.log(`UI server listening on port ${port}`))
