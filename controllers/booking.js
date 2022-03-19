const express = require('express')
const router = express.Router()
const Bookings = require('../models/bookings')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false
  },
  viewPath: path.resolve('./views/')
}

router.get('/', (req, res) => {
  res.render('booking')
})

router.get('/confirmation/:id', async (req, res, next) => {
  try {
    let booking = await Bookings.findById(req.params.id)

    res.render('confirmation', { booking })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    let foundBooking = await Bookings.findOne({ time: req.body.time })
    if (foundBooking) {
      let error = 'Sorry that time is not available!'
      res.render('booking', { error })
    } else {
      let booking = await Bookings.create(req.body)

      var transporter = nodemailer.createTransport({
        host: 'smtp.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: 'kristenomahony@hotmail.com',
          pass: 'BigBob84'
        }
      })
      transporter.use('compile', hbs(handlebarOptions))
      let name = req.body.name
      let time = req.body.time

      let info = await transporter.sendMail({
        from: 'kristenomahony@hotmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Appointment Confirmed', // Subject line
        template: 'email',
        context: {
          name: req.body.name, // replace {{name}} with Adebola
          time: req.body.time,
          service: req.body.service // replace {{company}} with My Company
        }
        // text: 'Hello world?', // plain text body
        // text: `Hi ${{ name }}, your appointment is confirmed for Sunday at ${{
        //   time
        // }}! Thanks again, Katie`
      })

      console.log('Message sent: %s', info.messageId)
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      //   Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      // }

      // main().catch(console.error)
      // var mailOptions = {
      //   from: 'kristenomahony@hotmail.com',
      //   to: req.body.email,
      //   subject: 'Thank you for your booking',
      //   html:
      //     '<p>Hi {{booking.name}},</p><div>Thanks for booking an appointment, we will see you on Sunday at {{booking.time}}!</div><div>Thanks again, Katie</div>'
      // }
      //
      // transporter.sendMail(mailOptions, function(error, info) {
      //   if (error) {
      //     console.log('nope')
      //   } else {
      //     console.log('Email sent: ' + info.response)
      //   }
      // })

      res.redirect(`booking/confirmation/${booking._id}`)
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
