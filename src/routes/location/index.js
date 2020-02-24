const _BASE_KEY = 'corvallis:users'
const LOCATION_KEY = `${_BASE_KEY}:location`

const _makeId = (userId) => {
  return `${_BASE_KEY}:${userId.toLowerCase()}`
}

const postLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body
  if (!userId) res.status(400).send('userId is required')
  if (!latitude) res.status(400).send('latitude is required')
  if (!longitude) res.status(400).send('longitude is required')

  const id = _makeId(userId)
  req.db.send_command(
    'GEOADD',
    [ LOCATION_KEY, latitude, longitude, id],
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
      if (!reply) {
        res.status(404).send(`cannot find userId(${userId})`)
      }
      if (reply.length < 1) {
        res.status(404).send(`location data of userId(${userId}) is empty`)
      }
      const location = reply[0]
      if (location.length !== 2) {
        res.status(404).send(`location data(${location}) of userId(${userId}) is incorrect`)
      }
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

const queryLocations = async (req, res) => {
  // TODO: query locations by GEORADIUS
  const locations = [
    {user: '1', longitude: '1.0', latitude: '1.0'},
    {user: '2', longitude: '2.0', latitude: '2.0'}
  ]
  res.status(200).send(locations)
}


module.exports = {
  postLocation,
  getLocation,
  queryLocations
}

