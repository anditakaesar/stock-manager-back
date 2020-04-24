import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as CustomStrategy } from 'passport-custom'
import jwt from 'jsonwebtoken'
import { keys } from './signopt'
import { env } from '../env'
import db from '../../models'
import logger from '../logger'

const bcrypt = require('bcrypt')

const { User } = db

export const strategy = {
  LOCAL_LOGIN: 'local-login',
  JWT_LOGIN: 'jwt-login',
}

const MSG = {
  DEFAULT_ERROR: 'user not found or wrong password!',
  LOGIN_SUCCESS: 'login success',
}

passport.serializeUser((user, next) => {
  next(null, user)
})

passport.deserializeUser((user, next) => {
  const newUser = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
  }

  next(null, newUser)
})

function validPassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

// STRATEGIES
passport.use(strategy.LOCAL_LOGIN,
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      process.nextTick(() => {
        User.findOne({
          where: {
            username,
          },
        })
          .then((user) => {
            if (user && validPassword(password, user.password)) {
              return done(null, user)
            }
            return done(null, false, { message: MSG.DEFAULT_ERROR })
          })
          .catch((errx) => {
            logger.error(errx.message, {
              // FATAL ERROR
              request: `${req.method} ${req.originalUrl}`,
            })
            return done(null, false, { message: errx.message })
          })
      }) // nextTick
    },
  )) // local-login

passport.use(strategy.JWT_LOGIN,
  new CustomStrategy(
    (req, done) => {
      process.nextTick(() => {
        jwt.verify(req.headers.authorization, keys.public, { algorithms: env.JWT_ALGORITHM },
          (err, decoded) => {
            if (err) {
              logger.error(err.message)
              return done(null, false, { message: err.message })
            }

            req.user = decoded
            return done(null, decoded)
          })
      })
    },
  ))

export default passport
