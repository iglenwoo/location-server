const router = require('express').Router()
const location = require('./location')

router.post('/locations', location.postLocation)
router.get('/locations/:id', location.getLocation)
router.get('/locations', location.queryLocations)

module.exports = router

