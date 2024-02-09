const express = require('express')
const User = require('./db/user');
const Match = require('./db/match')
const multer = require('multer')
const path = require('path')

const requireAuth = require('./middleware/requireAuth')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './userImages')
  }, 
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + req.user._id + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})


router.use(requireAuth)

router.post('/pickRandomUser', async(req, res) => {

    const user = req.body;
    console.log(user)
    let randomUser = 0;
    if(user.gender === 'homme'){
      randomUser = await User.aggregate([
        { $match: { gender: "femme", email: { $nin: user.lastMet2Users } } },
        { $sample: { size: 1 } },
    ]);
    }
    else if(user.gender === 'femme'){
      randomUser = await User.aggregate([
        { $match: { gender: "homme", email: { $nin: user.lastMet2Users }} },
        { $sample: { size: 1 } },
    ]);
    }
    else{
      randomUser = await User.aggregate([
        { $match: { email: { $nin: user.lastMet2Users }} },
        { $sample: { size: 1 } },
    ]);
    }
    
    if (randomUser.length === 0) {
        return res.status(404).json({ message: 'Aucun utilisateur trouvé.' });
    }
    console.log(randomUser[0])
    
    res.status(200).json(randomUser[0]);
    
})

router.post('/updateProfile', upload.single('profileImage'), async(req, res) => {
  //console.log(req.file)
  //console.log(req.user)
  console.log(req.body)
  try {
    const user = await User.findOne(req.user._id)
    //console.log(user)
    user.description = req.body.description;
    user.profileImage = req.file.filename;
    await user.save();

    return res.status(200).json({ message: 'Profil mis à jour' });
  } catch (error) {
    return res.status(401).json({ message: 'Erreur, nous ne trouvons pas votre compte' });
  }
});

router.post('/userMatched', async (req, res) => {

    const { metUser, user } = req.body;
    const fulluser = await User.findOne({ email: req.body.user.mail });

    if (!user)
		return res.status(401).send({ message: "Nous ne trouvons plus votre compte..." });

    //console.log(fulluser)

    const existingMatch = await Match.findOne({
        $or: [
          { Liker: fulluser._id, Liked: metUser._id },
          { Liker: metUser._id, Liked: fulluser._id },
        ],
      });

      if (existingMatch) {
        if (existingMatch.Liked.equals(fulluser._id)) {
          existingMatch.matchAccepted = true;
          await existingMatch.save();
          console.log('Match accepté');
          return res.status(200).json({ message: 'Match accepté' });
        }
        else
        {
            console.log('Le match est déjà en cours');
            return res.status(200).json({ message: 'Vous avez déjà essayé de matcher avec cette personne...' });
        }
      }
    
      const newMatch = new Match({ Liker: fulluser._id, Liked: metUser._id });
      await newMatch.save();
      console.log('Nouveau match créé');

    console.log('User matched:', req.body); 
    res.status(200).json({ message: 'Match créé avec succès' });
  });

module.exports = router