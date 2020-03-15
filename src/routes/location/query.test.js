const supertest = require('supertest');
const app = require('../../server');
const redis = require('../../server/redis')

const request = supertest(app)

const LOCATIONS_API = '/locations'

const mockParam = { latitude: 44.565108, longitude: -123.275943, desc: 'The Valley Library' }
const mockLocations = [
  { userId: 'user1', latitude: 44.566388, longitude: -123.275309, frFromTheValleyLib: 497.93, desc: 'Milne Computer Center' },
  { userId: 'user2', latitude: 44.567111, longitude: -123.278593, frFromTheValleyLib: 958.00, desc: 'Kelly Engineering Building' },
  { userId: 'user3', latitude: 44.563139, longitude: -123.278657, frFromTheValleyLib: 970.27, desc: 'Dixon' },
  { userId: 'user4', latitude: 44.567149, longitude: -123.283586, frFromTheValleyLib: 2112.23, desc: 'Withycombe Hall' }
]

const unit = 'ft'
const buildUrl = ({ longitude, latitude, radius}) => {
  return `${LOCATIONS_API}?longitude=${longitude}&latitude=${latitude}&radius=${radius}&unit=${unit}`
}

describe('Test /locations', () => {
  beforeAll(async () => {
    for (const loc of mockLocations) {
      await request.post(LOCATIONS_API).send({
        userId: loc.userId,
        longitude: loc.longitude,
        latitude: loc.latitude
      })
    }
  })

  it('returns no location', async done => {
    const url = buildUrl({longitude: mockParam.longitude, latitude: mockParam.latitude, radius: 400})
    const res = await request.get(url)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(0)

    done()
  })

  it('returns one location', async done => {
    const url = buildUrl({longitude: mockParam.longitude, latitude: mockParam.latitude, radius: 500})
    const res = await request.get(url)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    const loc = res.body[0]
    const parts = loc.split(':')
    const userId = parts[1]
    expect(userId).toBe(mockLocations[0].userId)

    done()
  })

  it('returns 3 locations', async done => {
    const url = buildUrl({longitude: mockParam.longitude, latitude: mockParam.latitude, radius: 1100})
    const res = await request.get(url)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(3)

    done()
  })

  afterAll(() => {
    redis.flushall()
    redis.quit()
  })
})
