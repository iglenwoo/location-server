const router = require('express').Router()
const location = require('./location')

router.post('/location', location.storeLocation)
router.get('/location', location.getLocation)

module.exports = router

