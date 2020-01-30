const server = require('./server')

const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Location Server listening on port '${port}'!`))
