import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import logger from './logger'
import passport, { strategy } from './auth/passport'
import { env } from './env'

const app = express()

app.use(helmet())
app.use(compression())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// global middleware
app.use((req, res, next) => {
  next()
})

// router
app.use('/admin', require('./admin/admin-router').default)
app.use('/auth', require('./auth/auth-router').default)
app.use('/stock', passport.authenticate(strategy.JWT_LOGIN), require('./stock/stock-router').default)

// end point for error handling
app.use((err, req, res, next) => {
  if (err) {
    if (!err.status) err.status = env.HTTP_STATUS.SERVER_ERROR

    logger.error(err.message, {
      request: `${req.method} ${req.originalUrl}`,
      intmsg: err.intmsg,
    })

    res.status(err.status).json({
      message: err.message,
    })
  } else {
    next()
  }
})

app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  })
})

const application = {
  app,
}

export default application
