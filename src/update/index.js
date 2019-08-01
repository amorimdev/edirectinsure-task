'use strict'

const role = 'task'
const { task } = require('mongo-client/models')
const { pick, omit } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Update () {
  const seneca = this

  seneca.add({ role, cmd: 'update' }, cmdUpdate)

  async function cmdUpdate (args, done) {
    const params = pick(args, PICK_FIELDS)

    return updateTask(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function updateTask (params) {
    return new Promise((resolve, reject) => {
      task.findOneAndUpdate(pick(params, [ '_id' ]), {
        $set: omit(params, [ '_id' ])
      }, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!entity) {
          return reject(new Error('Task not found'))
        }

        entity = { ...entity.toObject(), ...params }
        seneca.log.info(LOG_TAG, { entity })
        return resolve(entity)
      })
    })
  }

  return {
    name: role
  }
}
