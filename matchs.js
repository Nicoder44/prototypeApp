const express = require('express')
const User = require('./db/user');
const Match = require('./db/match')

const requireAuth = require('./middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/pickRandomUser', async(req, res) => {
    
    const randomUser = await User.aggregate([
        { $sample: { size: 1 } },
    ]);

    if (randomUser.length === 0) {
        return res.status(404).json({ message: 'Aucun utilisateur trouvé.' });
    }
    console.log(randomUser[0])
    
    res.status(200).json(randomUser[0]);
    
})

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
        // Si un match existe, mettre à jour matchAccepted si c'est l'utilisateur attendu
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