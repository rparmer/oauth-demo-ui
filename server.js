const express = require('express')
const axios = require('axios')
const port = process.env.PORT || 5000

const app = express()
app.use(express.static(__dirname + '/public'))

let token = ''

app.get('/login', (req, res) => {
    console.log(req.headers)
    token = `${req.query.token_type} ${req.query.access_token}`
    res.redirect('/')
})

app.get('/logout', (req, res) => {
    token = ''
    res.redirect('/')
})

app.get('/test/unsecured', (req, res) => {
    axios({
        method: 'GET',
        url: `http://localhost:8080/greeting/unsecured`
    }).then(response => {
        res.send(response.data)
    })
})

app.get('/test/secured', (req, res) => {
    axios({
        method: 'GET',
        url: `http://localhost:8080/greeting/secured`,
        headers: { 'Authorization': token }
    }).then(response => {
        res.send(response.data)
    }).catch(err => {
        res.send(err.message)
    })
})

app.listen(port, () => console.log(`UI server listening on port ${port}`))
