const mongoose = require('mongoose')

module.exports = mongoose.model('bookings', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  service: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})
