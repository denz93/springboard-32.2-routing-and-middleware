import request from 'supertest'
import {app} from '../../app.mjs'
import {db} from '../../db.mjs'

db.init('testdb.json')

describe('Shopping list route', () => {
  beforeEach(() => {
    db.write({})
  })
  test('GET /items', async () => {
    let response = await request(app).get('/api/items')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({items: []})

    db.write({items: [
      {name: 'test1', price: 1},
      {name: 'test2', price: 2},
    ]})
    response = await request(app).get('/api/items')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({items: [ 
      {name: 'test1', price: 1},
      {name: 'test2', price: 2}
    ]})
  })

  test('GET /items/:name', async () => {
    db.write({items: [
      {name: 'test1', price: 1},
      {name: 'test2', price: 2},
    ]})
    let response = await request(app).get('/api/items/test1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({item: {name: 'test1', price: 1}})

    response = await request(app).get('/api/items/test4')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({item: null})
  })

  test('POST /items', async () => {
    let response = await request(app).post('/api/items').send({name: 'test1', price: 1})
    expect(response.status).toBe(200)
    expect(response.body).toEqual({added: {name: 'test1', price: 1}})

    response = await request(app).post('/api/items').send({name: 'test1', price: 1})
    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: 'Item already exists'})
  })

  test('PATCH /items/:name', async () => {
    db.write({items: [
      {name: 'test1', price: 1},
      {name: 'test2', price: 2},
    ]})
    let response = await request(app).patch('/api/items/test1').send({name: 'test1', price: 2})
    expect(response.status).toBe(200)
    expect(response.body).toEqual({updated: {name: 'test1', price: 2}})

    response = await request(app).patch('/api/items/test1').send({name: 'test4', price: 1})
    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: 'Name cannot be changed'})
  })

  test('DELETE /items/:name', async () => {
    db.write({items: [
      {name: 'test1', price: 1},
      {name: 'test2', price: 2},
    ]})
    let response = await request(app).delete('/api/items/test1')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({message: 'Deleted'})
  })
})