/* eslint-disable new-cap */
import winston, { format } from 'winston'
import moment from 'moment'
import path from 'path'

const {
  combine, timestamp, label, printf,
} = format
const myFormat = printf((info) => {
  const metas = []
  Object.keys(info).forEach((e) => {
    let value = ''
    if (e !== 'timestamp' && e !== 'label' && e !== 'level' && e !== 'message') {
      value = info[e]
      if (value !== '' && value !== undefined) {
        metas.push(`${e}:${value}`)
      }
    }
  })

  return `${info.timestamp} [${info.label}] ${info.level.toUpperCase()} ${info.message} | ${metas.join(' | ')}`
})

const dateStr = moment().format('YYYY-MM-DD')
const fileConfig = {
  filename: path.join(__dirname, `../logs/${dateStr}.log`),
  level: 'debug',
  format: combine(
    label({ label: 'DEVELOP' }),
    timestamp(),
    myFormat,
  ),
}

const consoleConfig = {
  level: 'debug',
  format: combine(
    label({ label: 'DEVELOP' }),
    timestamp(),
    myFormat,
  ),
}

// const logglyConfig = {
//   token: env.LOGGLY_TOKEN,
//   subdomain: env.LOGGLY_SUBDOMAIN,
//   tags: ['production', env.LOGGLY_TAG],
//   json: true
// }

function InitLogger() {
  if (process.env.NODE_ENV === 'development') {
    return new winston.createLogger({
      transports: [
        new winston.transports.File(fileConfig),
        new winston.transports.Console(consoleConfig),
      ],
    }) // end return
  }

  return new winston.createLogger({
    transports: [
      new winston.transports.File(fileConfig),
    ],
  })
  // return new winston.createLogger({
  //   transports: [
  //     new Loggly(logglyConfig),
  //   ],
  // })
}

const logger = InitLogger()

export default logger
