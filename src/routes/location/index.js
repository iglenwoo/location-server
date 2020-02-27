const _BASE_KEY = 'corvallis:users'
const LOCATION_KEY = `${_BASE_KEY}:location`

const _makeId = (userId) => {
  return `${_BASE_KEY}:${userId.toLowerCase()}`
}

const postLocation = async (req, res) => {
  const { userId, longitude, latitude } = req.body
  if (!userId) res.status(400).send('userId is required')
  if (!longitude) res.status(400).send('longitude is required')
  if (!latitude) res.status(400).send('latitude is required')

  const id = _makeId(userId)
  req.db.send_command(
    'GEOADD',
    [ LOCATION_KEY, longitude, latitude, id],
    (err, reply) => {
      if (err) {
        console.error('Error storeLocation!')
        console.error('req.body:', req.body)
        console.error('Error:', err)
        res.status(500).send(err)
      } else {
        res.status(200).send(req.body)
      }
  })
}

const getLocation = async (req, res) => {
  const userId = req.params.id
  if (!userId) {
    res.status(400).send('userId is required')
  }

  const id = _makeId(userId)
  req.db.send_command(
    'GEOPOS',
    [ LOCATION_KEY, id ],
    (err, reply) => {
    if (err) {
      console.error('Error getLocation!')
      console.error('userId:', userId)
      console.error('Error:', err)
      res.status(500).send(err)
    } else {
      if (!reply) res.status(404).send(`cannot find userId(${userId})`)
      if (reply.length < 1) res.status(404).send(`location data of userId(${userId}) is empty`)
      const location = reply[0]
      if (location.length !== 2) res.status(404).send(`location data(${location}) of userId(${userId}) is incorrect`)

      const longitude = location[0]
      const latitude = location[1]
      res.status(200).send({
        userId: userId,
        longitude: longitude,
        latitude: latitude
      })
    }
  })
}

const _isValidUnit = (unit) => {
  const validUnits = [
    'm', 'km', 'mi', 'ft'
  ]
  let isValid = false
  for (const u of validUnits) {
    if (u === unit) isValid = true
  }

  return isValid
}

const queryLocations = async (req, res) => {
  const { longitude, latitude, radius, unit } = req.query
  if (!longitude) res.status(400).send('longitude is required')
  if (!latitude) res.status(400).send('latitude is required')
  if (!radius) res.status(400).send('radius is required')
  if (!unit) res.status(400).send('radius is required')
  if (!_isValidUnit(unit)) res.status(400).send(
    `unit (${unit})is invalid, valid units are 'm' | 'km' | 'mi' | 'ft'`)

  req.db.send_command(
    'GEORADIUS',
    [ LOCATION_KEY, longitude, latitude, radius, unit],
    (err, reply) => {
      if (err) {
        console.error('Error queryLocations!')
        console.error('req.query:', req.query)
        console.error('Error:', err)
        res.status(500).send(err)
      } else {
        res.status(200).send(reply)
      }
    }
  )
}


module.exports = {
  postLocation,
  getLocation,
  queryLocations
}

