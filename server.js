const express = require('express');
const path = require('path');
require('dotenv').config();
require('./db/blog');
require('./db/user');
const { connectDB, findBlog } = require('./db/db');
const User = require('./db/user');
const Token = require('./db/token');
const sendEmail = require('./utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require("bcrypt");

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

app.post('/api/users', async (req, res) => {
  try {

    let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "Un utilisateur utilise déjà cette adresse mail." });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

   const { prenom, nom, email, password } = req.body;
    user = await new User({ ...req.body, password: hashPassword }).save();

    //const newUser = new User({ prenom, nom, email, password });
    //await newUser.save();
    const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "Un Email de confirmation vous a été envoyé" });
    
    console.log("Utilisateur ajouté:" + prenom + ", " + password)
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ msg: 'Erreur lors de l\'ajout de l\'utilisateur' });
  }
});

app.post('/api/login',async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Recherchez l'utilisateur dans la base de données par le nom d'utilisateur
      const user = await findBlog("659aacac68b0ba3c805f294a");
      console.log(user);
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
//https://www.youtube.com/watch?v=T6rElSLldyc&ab_channel=CyberWolves