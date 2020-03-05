const supertest = require('supertest');
const app = require('../../server');

const request = supertest(app)

const BASE_API = '/locations'
const existingUser = 'user001'
const location = {
  longitude: -123.306662,
  latitude: 44.550175
}
const user = {
  userId: existingUser,
  longitude: location.longitude,
  latitude: location.latitude
}


it('Posts the location of a user', async done => {
  const res = await request.post(BASE_API).send(user)

  expect(res.status).toBe(200)
  expect(res.body).toMatchObject(user)
  done()
})

it('Gets the location of a existing user', async done => {
  const res = await request.get(`${BASE_API}/${existingUser}`)
  expect(res.status).toBe(200)
  expect(res.body.userId).toBe(existingUser)
  done()
})

it('Gets 404 of a not existing user', async done => {
  const _notExistingUser = 'non-user'
  const res = await request.get(`${BASE_API}/${_notExistingUser}`)
  expect(res.status).toBe(404)
  done()
})
