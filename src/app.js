import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import logger from './logger'

const app = express()

app.use(helmet())
app.use(compression())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

// global middleware
app.use((req, res, next) => {
  next()
})

// router
app.use('/admin', require('./admin/adminRouter').default)

// end point for error handling
app.use((err, req, res, next) => {
  if (err) {
    if (!err.status) err.status = 500

    logger.error(err.message, {
      request: `${req.method} ${req.originalUrl}`,
      intmsg: err.intmsg,
    })

    res.status(err.status).json({
      message: err.message,
    })
  }
  next()
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
