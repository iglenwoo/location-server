const router = require('express').Router()
const location = require('./location')

export const LOCATIONS_API = '/locations'

router.post(`${LOCATIONS_API}`, location.postLocation)
router.get(`${LOCATIONS_API}}/:id`, location.getLocation)
router.get(`${LOCATIONS_API}`, location.queryLocations)

module.exports = router

