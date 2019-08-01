'use strict'

module.exports = {
  pattern: {
    role: 'task',
    cmd: 'update'
  },

  payload: {
    notFound: {
      _id: '5d41fea7f012517b1edf34e6'
    },

    change: _id => ({
      _id,
      description: 'change'
    }),

    close: _id => ({
      _id,
      status: 'closed'
    })
  }
}
