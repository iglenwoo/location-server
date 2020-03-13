const redis = require('redis')
const { AbortError, AggregateError, ReplyError } = require("redis");

const client = redis.createClient()
client.debug_mode = true

client.on("error", function(err) {
  console.log('Redis Error ' + err)

  assert(err instanceof Error);
  assert(err instanceof AbortError);
  assert(err instanceof AggregateError);

  // The set and get are aggregated in here
  assert.strictEqual(err.errors.length, 2);
  assert.strictEqual(err.code, "NR_CLOSED");
});

module.exports = client
