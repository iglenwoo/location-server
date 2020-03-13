const supertest = require('supertest');
const app = require('../../server');
const redis = require('../../server/redis')

const request = supertest(app)

const LOCATIONS_API = '/locations'
const mockUserId = 'user001'
const mockUser = {
  userId: mockUserId,
  longitude: -123.306662,
  latitude: 44.550175
}

describe('Test /locations', () => {
  it('Posts the location of a user', async done => {
    const res = await request.post(LOCATIONS_API).send(mockUser)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(mockUser)
    done()
  })

  it('Gets the location of a existing user', async done => {
    const res = await request.get(`${LOCATIONS_API}/${mockUserId}`)

    expect(res.status).toBe(200)
    expect(res.body.userId).toBe(mockUserId)
    done()
  })

  it('Gets 404 of a not existing user', async done => {
    const mockNonUserId = 'non-user'
    const res = await request.get(`${LOCATIONS_API}/${mockNonUserId}`)

    expect(res.status).toBe(404)
    done()
  })

  afterAll(() => {
    redis.flushall()
    redis.quit()
  })
})
