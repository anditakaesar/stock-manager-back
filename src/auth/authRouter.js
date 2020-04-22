import { Router } from 'express'
import jwt from 'jsonwebtoken'
import passport, { strategy } from './passport'
import { env } from '../env'
import { keys } from './signopt'
import { genError } from '../utils'

const router = Router()
const MSG = {
  LOGIN_ERROR: 'error logging in',
  LOGIN_SUCCESS: 'user success login',
  TOKEN: {
    VALID: 'token verified',
    INVALID: 'token expired',
  },
}

function genToken(payload) {
  const signOpt = {
    expiresIn: env.JWT_EXPSEC,
    algorithm: env.JWT_ALGORITHM,
  }

  const token = jwt.sign(payload, keys.private, signOpt)
  return token
}

function genPayload(user) {
  const encoded = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
  }

  return encoded
}

router.post('/login', (req, res, next) => {
  passport.authenticate(strategy.LOCAL_LOGIN,
    (err, user, info) => {
      if (!user) {
        next({ message: info.message })
      } else {
        req.login(user, (errx) => {
          if (errx) {
            next(genError(MSG.LOGIN_ERROR, errx.message))
          }

          const userpayload = genPayload(user)
          res.status(env.HTTP_STATUS.OK).json({
            message: MSG.LOGIN_SUCCESS,
            user: userpayload,
            token: genToken(userpayload),
          })
        })
      }
    })(req, res, next)
}) // login

router.get('/verify', passport.authenticate(strategy.JWT_LOGIN, {
  successRedirect: 'verify/success',
  failureRedirect: 'verify/fail',
}))

router.get('/verify/success', passport.authenticate(strategy.JWT_LOGIN), (req, res) => {
  res.status(200).json({
    message: MSG.TOKEN.VALID,
    verified: true,
    user: req.user,
  })
})

router.get('/verify/fail', (req, res) => {
  res.status(200).json({
    message: MSG.TOKEN.INVALID,
    verified: false,
  })
})

export default router
