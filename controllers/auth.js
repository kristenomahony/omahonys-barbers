const express = require('express')
const router = express.Router()
const Bookings = require('../models/bookings')
const Users = require('../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/appointments', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.redirect('/login')
    } else {
      let bookings = await Bookings.find({}).sort('time')
      res.render('appointments', { bookings })
    }
  } catch (err) {
    next(err)
  }
})

router.delete('/appointments/:id', async (req, res, next) => {
  try {
    let cancelledBooking = await Bookings.findByIdAndDelete(req.params.id)
    res.redirect('/auth/appointments')
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    let loggedUser = await Users.findOne({
      email: req.body.email,
      password: req.body.password
    })

    if (loggedUser) {
      req.login(loggedUser, err => {
        res.redirect('./appointments')
      })
    } else {
      throw new Error('Email or password is wrong!')
    }
  } catch (err) {
    next(err)
  }
})

router.get('/logout', (req, res, next) => {
  try {
    req.logout()
    req.session.destroy(err => {
      if (err) {
        next(err)
      }
      res.clearCookie('connect.sid')
      res.redirect('/auth/login')
    })
  } catch (err) {
    throw err
  }
})
module.exports = router
