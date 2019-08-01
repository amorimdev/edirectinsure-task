'use strict'

const Create = require('../src/create')
const Select = require('../src/select')
const Update = require('../src/update')
const Delete = require('../src/delete')

const seneca = require('seneca')()

seneca.use(Create)
seneca.use(Select)
seneca.use(Update)
seneca.use(Delete)

seneca.listen({
  type: 'http',
  host: process.env.TASK_HOST || '0.0.0.0',
  port: process.env.TASK_PORT || 8204,
  pin: { role: 'task', cmd: '*' }
})

seneca.ready(() => {
  const { mongoClient } = require('mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
