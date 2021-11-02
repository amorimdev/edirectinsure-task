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
  ...((process.env.TASK_TRANSPORT === 'amqp' && {
    type: process.env.TASK_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.TASK_TRANSPORT || 'http',
    host: process.env.TASK_HOST || '0.0.0.0',
    port: process.env.TASK_PORT || process.env.PORT || 8204,
    protocol: process.env.TASK_PROTOCOL || 'http'
  }),
  pin: { role: 'task', cmd: '*' }
})

seneca.ready(() => {
  const { mongoClient } = require('edirectinsure-mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
