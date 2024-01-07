const express = require('express')
const path = require('path')
require('dotenv').config()
require('./db/blog')
const connectDB = require('./db/db');
const findBlog = require('./db/db');

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

app.post('/api/login',async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Recherchez l'utilisateur dans la base de données par le nom d'utilisateur
      findBlog("659aacac68b0ba3c805f294a");
  
      if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
      else{
        console.log("cool");
      }
    }
    catch(e){
        console.log(e);
    }
})

app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(PORT, () => {
    console.log(`le serveur est lancé sur le port : ${PORT}`)
})