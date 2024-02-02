const express = require('express')

const requireAuth = require('./middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get('/', async(req, res) => {
    console.log("ok ca marche")
})

module.exports = router