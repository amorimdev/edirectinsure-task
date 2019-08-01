/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const { Seneca } = require('./helpers')

const Mock = require('./mock/update')
const { getId } = require('./mock/task')

describe('Task Update Tests', () => {
  let seneca = null

  before(done => {
    Seneca()
      .then(instance => {
        seneca = instance
        return done(null)
      })
      .catch(done)
  })

  beforeEach(() => { debugger })

  it('Expect seneca instance not equal to null', done => {
    try {
      expect(seneca).not.to.equal(null)
      done(null)
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not update an task because task not found', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.notFound
      const expectMessageError = 'Task not found'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to update an task', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.change(getId())
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(typeof response.result).to.be.equal('object')
        expect(typeof response.result._id).to.be.equal('string')
        expect(response.result.description).to.be.equal(payload.description)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to update status to close on the task', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.close(getId())
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(typeof response.result).to.be.equal('object')
        expect(typeof response.result._id).to.be.equal('string')
        expect(response.result.status).to.be.equal(payload.status)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })
})
