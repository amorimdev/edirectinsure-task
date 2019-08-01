'use strict'

const role = 'task'
const { task, project } = require('mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Create () {
  const seneca = this

  seneca.add({ role, cmd: 'create' }, cmdCreate)

  async function cmdCreate (args, done) {
    const params = pick(args, PICK_FIELDS)

    if (Object.keys(params).length !== 2) {
      return done(null, {
        status: false,
        message: 'Invalid arguments'
      })
    }

    return createTask(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function createTask (params) {
    return new Promise((resolve, reject) => {
      task.create(params, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        project.findOneAndUpdate(
          { _id: params.project },
          { $push: { tasks: entity } },
          err => {
            if (err) {
              seneca.log.fatal(LOG_TAG, err.message || err)
              return reject(err)
            }

            entity = {
              ...entity.toObject(),
              _id: entity._id.toString()
            }

            seneca.log.info(LOG_TAG, { entity })
            return resolve(entity)
          })
      })
    })
  }

  return {
    name: role
  }
}
