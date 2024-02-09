const express = require('express');
const path = require('path');
require('dotenv').config();
//require('./db/blog');
require('./db/user');
const { connectDB } = require('./db/db');
const User = require('./db/user');
const Match = require('./db/match.js')
const Token = require('./db/token');
const Msg = require('./db/msg.js')
const sendEmail = require('./utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const cors = require("cors");
const matchRoutes = require("./matchs.js");
const http = require('http')


const PORT = process.env.PORT || 5000

const app = express()

const server2 = http.createServer(app);


connectDB();

app.use(express.json())
app.use(cors());

app.use(express.static('client/build'))

app.use('/api/matchs', matchRoutes);

app.use('/images', express.static('./userImages'));

app.get('/api/Loveers', (_, res) => {
    res.send({
        msg: 'Hello to the World !'
    })
})

const server = app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
})

const io = require('socket.io')(server);

const userSockets = {};

io.on('connection', (socket) => {
console.log(`Socket ${socket.id} connected`)

socket.on('joinChat', async ({ownChat, chatWith}) => {
  try {
    // Recherche des messages entre ownChat et chatWith
    const messages = await Msg.find({
        $or: [
            { sender: ownChat, receiver: chatWith },
            { sender: chatWith, receiver: ownChat }
        ]
    }).sort({ timestanmp: 1 }); // Tri par date croissante

    socket.emit('chatHistory', messages);
    
    // Enregistrer la socket de l'utilisateur dans la structure de données
    userSockets[ownChat] = socket;
    console.log(`User ${ownChat} joined chat`);
    } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de chat:', error);
}
});

socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
  console.log(`Received message from ${senderId} to ${receiverId}: ${message}`);

  try {
      // Recherchez la conversation entre l'expéditeur et le destinataire
      const existingMessages = await Msg.find({
          $or: [
              { sender: senderId, receiver: receiverId },
              { sender: receiverId, receiver: senderId }
          ]
      }).sort({ timestamp: 1 }); // Triez par ordre croissant de timestamp pour obtenir les messages les plus anciens en premier

      // Vérifiez le nombre de messages dans la conversation
      if (existingMessages.length >= 10) {
          // Si le nombre de messages dépasse 10, supprimez le message le plus ancien
          await Msg.findByIdAndDelete(existingMessages[0]._id);
      }

      // Enregistrez le nouveau message
      const newMessage = await new Msg({
          sender: senderId,
          receiver: receiverId,
          content: message
      }).save();

      // Diffusez le message au destinataire
      const receiverSocket = userSockets[receiverId];
      if (receiverSocket) {
          receiverSocket.emit('message', { senderId, message });
      } else {
          console.log(`User ${receiverId} is not connected`);
      }
  } catch (error) {
      console.error('Error while saving message:', error);
  }
});

socket.on('disconnect', () => {
  console.log(`Socket ${socket.id} disconnected`);
});
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

    const { prenom, nom } = req.body;
    user = await new User({ ...req.body, password: hashPassword }).save();

    const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}users/verify/${user.id}/${token.token}`;
    const emailText = `Merci de vous être inscrit sur PolyLove. Pour valider votre compte, veuillez cliquer sur le lien suivant : ${url}`;

    const emailHTML = `<html lang="en"><head><style>body{font-family:'Arial',sans-serif;background-color:#1c1c1c;color:#fff;padding:20px;} .container{max-width:600px;margin:0 auto;background-color:#333;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(255,0,0,.5);}p.link-paragraph {word-wrap: break-word;max-width:100%;}h1{color:#ff0000;}p{color:#fff;line-height:1.6;}a{display:inline-block;margin-top:20px;padding:10px 20px;background-color:#ff0000;color:#fff;text-decoration:none;border-radius:5px;}footer{margin-top:20px;color:#999;font-size:12px;}</style></head><body><div class="container"><h1>Bienvenue sur PolyLove !</h1><p>Merci de vous être inscrit sur PolyLove. Pour valider votre compte, veuillez cliquer sur le lien ci-dessous :</p><a href="${url}" target="_blank">Valider Mon Compte</a><p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p><details><summary>lien</summary><p>${url}</p></details><p>Merci de faire partie de la communauté PolyLove !</p></div><footer>Email généré automatiquement par PolyLove. Ne pas répondre à cet e-mail.</footer></body></html>`;


		await sendEmail(user.email, "Validation de compte - PolyLove", emailText, emailHTML);

		res
			.status(201)
			.send({ message: "Un Email de confirmation vous a été envoyé" });
    
    console.log("Utilisateur ajouté:" + prenom + ", " + nom)
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
    res.status(500).json({ msg: 'Erreur lors de l\'ajout de l\'utilisateur' });
  }
});

app.post('/auth', async (req, res) => {
  try{
    
    const user = await User.findOne({email: req.body.email});
    //console.log(user)
    if (!user)
			return res.status(401).send({ message: "Oops... L'email ne semble pas exister dans la base de PolyLove !" });
   
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (!validPassword) {
      console.log(user.toString() + " tried to connect but entered the wrong password.");
			return res.status(401).send({ message: "Invalid Email or Password" });
    }
    
    if (!user.verified) {
      console.log(user.toString() + " tried to connect but is not yet verified.");
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/verify/${user.id}/${token.token}`;
        const emailText = `Merci de vous être inscrit sur PolyLove. Pour valider votre compte, veuillez cliquer sur le lien suivant : ${url}`;
        const emailHTML = `<html lang="en"><head><style>body{font-family:'Arial',sans-serif;background-color:#1c1c1c;color:#fff;padding:20px;} .container{max-width:600px;margin:0 auto;background-color:#333;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(255,0,0,.5);}p.link-paragraph {word-wrap: break-word;max-width:100%;}h1{color:#ff0000;}p{color:#fff;line-height:1.6;}a{display:inline-block;margin-top:20px;padding:10px 20px;background-color:#ff0000;color:#fff;text-decoration:none;border-radius:5px;}footer{margin-top:20px;color:#999;font-size:12px;}</style></head><body><div class="container"><h1>Bienvenue sur PolyLove !</h1><p>Merci de vous être inscrit sur PolyLove. Pour valider votre compte, veuillez cliquer sur le lien ci-dessous :</p><a href="${url}" target="_blank">Valider Mon Compte</a><p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p><details><summary>lien</summary><p>${url}</p></details><p>Merci de faire partie de la communauté PolyLove !</p></div><footer>Email généré automatiquement par PolyLove. Ne pas répondre à cet e-mail.</footer></body></html>`;

        await sendEmail(user.email, "Validation de compte - PolyLove", emailText, emailHTML);
      }

      return res
        .status(400)
        .send({ message: "Votre adresse mail n'est pas vérifiée. Un eMail vous a été renvoyé." });
    }
    
      const token = user.generateAuthToken();

    
      const existingMatches = await Match.find({
        $or: [
          { Liker: user._id, matchAccepted: true },
          { Liked: user._id, matchAccepted: true }
        ]
      });
      
      let matchedUsersIds = [];

      for (const match of existingMatches) {
        if (match.Liker.equals(user._id)) {
          matchedUsersIds.push(match.Liked);
        } else if (match.Liked.equals(user._id)) {
          matchedUsersIds.push(match.Liker);
        }
      }
      
      let matchedUsers = [];  

      for (const userId of matchedUsersIds) {
        try {
          const user = await User.findById(userId);
          if (user) {
            matchedUsers.push(user);
          }
        } catch (error) {
          console.error(`Erreur lors de la recherche de l'utilisateur avec l'ID ${userId}:`, error);
        }
      }
      
      console.log(matchedUsers);


      const mail = user.email; const prenom = user.prenom; const nom = user.nom; const gender = user.gender; const _id = user._id;
      console.log(user.toString() + " succesfully logged in with the token: " + token);
		  res.status(200).send({ data: {token, mail, prenom, nom, gender, matchedUsers, _id}, message: "logged in successfully" });

  } catch(error){
    res.status(500).send({message: "Internal Server Error"});
  }
});

app.get("/verify/:id/:token", async (req, res) => {
  try{
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "L'utilisateur n'existe pas." });

    const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
    if (!token) return res.status(400).send({ message: "Le jeton n'est pas ou plus valide." });
    await User.findByIdAndUpdate(user._id, { verified: true });
		await token.deleteOne();
    
    res.status(200).send({ message: "Votre compte a bien été vérifié ! Profitez de nouvelles rencontres !" });
    
  } catch(error){
    console.log("Erreur lors de la validation du mail: " + error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})


