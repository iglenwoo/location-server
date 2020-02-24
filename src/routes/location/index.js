const storeLocation = async (req, res) => {
  console.log("store location");
  console.log("body", req.body);
  const key = 'corvallis'
  const { userId, latitude, longitude } = req.body
  if (!userId) res.status(400).send('userId is required')
  if (!latitude) res.status(400).send('latitude is required')
  if (!longitude) res.status(400).send('longitude is required')

  if (!req.db.GEOADD) {
    console.log('! req.db.GEOADD')
  }
  req.db.send_command(
    'GEOADD',
    [ key, latitude, longitude, userId.toLowerCase()],
    (error, reply) => {
      if (error) {
        console.error('error!!')
        console.error(error)
        res.status(500).send(error)
      } else {
        console.log('succeeded!')
        console.log(reply)
        res.send("stored!")
      }
  })
}

const getLocation = async (req, res) => {
  console.log("get location");
  console.log("rea.query", req.query);
  const userId = req.query.userId
  if (!userId) {
    res.status(400).send('userId is required')
  }
  res.send(`User: ${userId}`)
}

module.exports = {
  storeLocation,
  getLocation
}

