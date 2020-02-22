const express = require('express')
const bodyParser = require('body-parser')
const router = require('../routes')
const assert = require('assert')
const redis = require('redis')
const { AbortError, AggregateError, ReplyError } = require("redis");
const client = redis.createClient()
client.on("error", function(err) {
  console.log('Redis Error ' + err)

  assert(err instanceof Error);
  assert(err instanceof AbortError);
  assert(err instanceof AggregateError);

  // The set and get are aggregated in here
  assert.strictEqual(err.errors.length, 2);
  assert.strictEqual(err.code, "NR_CLOSED");
});

const app = express()

app.use(bodyParser.json())
// NOTE: 'parsing application/x-www-form-urlencoded' is necessary.
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', router)

module.exports = app
