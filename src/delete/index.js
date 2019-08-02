'use strict'

const role = 'task'
const { task, project } = require('edirectinsure-mongo-client/models')
const { pick } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')

module.exports = function Delete () {
  const seneca = this

  seneca.add({ role, cmd: 'delete' }, cmdDelete)

  async function cmdDelete (args, done) {
    const params = pick(args, PICK_FIELDS)

    if (!Object.keys(params).length) {
      return done(null, {
        status: false,
        message: 'Invalid arguments'
      })
    }

    return deleteTask(params)
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function deleteTask (params) {
    return new Promise((resolve, reject) => {
      task.deleteOne(params, (err, result) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!result.deletedCount) {
          return reject(new Error('Task not found'))
        }

        project.updateOne({},
          { $pull: { tasks: { $in: [ params._id ] } } },
          err => {
            if (err) {
              seneca.log.fatal(LOG_TAG, err.message || err)
              return reject(err)
            }

            seneca.log.info(LOG_TAG, { result })
            return resolve(result.deletedCount)
          })
      })
    })
  }

  return {
    name: role
  }
}
