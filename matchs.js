const express = require('express')
const User = require('./db/user');

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

module.exports = router