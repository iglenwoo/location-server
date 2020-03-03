const _BASE_KEY = 'corvallis:users'
const LOCATION_KEY = `${_BASE_KEY}:location`

const _makeId = (userId) => {
  return `${_BASE_KEY}:${userId.toLowerCase()}`
}

const postLocation = async (req, res) => {
  const { userId, longitude, latitude } = req.body
  if (!userId) return res.status(400).send('userId is required')
  if (!longitude) return res.status(400).send('longitude is required')
  if (!latitude) return res.status(400).send('latitude is required')

  const id = _makeId(userId)
  req.db.send_command(
    'GEOADD',
    [ LOCATION_KEY, longitude, latitude, id],
    (err, reply) => {
      if (err) {
        console.error('Error storeLocation!')
        console.error('req.body:', req.body)
        console.error('Error:', err)
        return res.status(500).send(err)
      } else {
        return res.status(200).send(req.body)
      }
  })
}

const getLocation = async (req, res) => {
  const userId = req.params.id
  if (!userId) return res.status(400).send('userId is required')

  const id = _makeId(userId)
  req.db.send_command(
    'GEOPOS',
    [ LOCATION_KEY, id ],
    (err, reply) => {
    if (err) {
      console.error('Error getLocation!')
      console.error('userId:', userId)
      console.error('Error:', err)
      return res.status(500).send(err)
    } else {
      if (!reply) return res.status(404).send(`cannot find userId(${userId})`)
      if (reply.length < 1) return res.status(404).send(`location data of userId(${userId}) is empty`)
      const location = reply[0]
      if (location === null) return res.status(404).send(`cannot find userId(${userId})`)
      if (location.length !== 2) return res.status(404).send(`location data(${location}) of userId(${userId}) is incorrect`)

      const longitude = location[0]
      const latitude = location[1]
      return res.status(200).send({
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
  if (!longitude) return res.status(400).send('longitude is required')
  if (!latitude) return res.status(400).send('latitude is required')
  if (!radius) return res.status(400).send('radius is required')
  if (!unit) return res.status(400).send('radius is required')
  if (!_isValidUnit(unit)) return res.status(400).send(
    `unit (${unit})is invalid, valid units are 'm' | 'km' | 'mi' | 'ft'`)

  req.db.send_command(
    'GEORADIUS',
    [ LOCATION_KEY, longitude, latitude, radius, unit],
    (err, reply) => {
      if (err) {
        console.error('Error queryLocations!')
        console.error('req.query:', req.query)
        console.error('Error:', err)
        return res.status(500).send(err)
      } else {
        return res.status(200).send(reply)
      }
    }
  )
}


module.exports = {
  postLocation,
  getLocation,
  queryLocations
}

