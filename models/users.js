const mongoose = require('mongoose')

// Create the results moodel
module.exports = mongoose.model('users', {
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
