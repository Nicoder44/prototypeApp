const express = require('express')
const path = require('path')
require('dotenv').config()
const connectDB = require('./db/db');

const PORT = process.env.PORT || 5000

const app = express()

connectDB();

app.use(express.json())

app.use(express.static('client/build'))

app.get('/api/Loveers', (_, res) => {
    res.send({
        msg: 'Hello to the World !'
    })
})

app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port : ${PORT}`)
})