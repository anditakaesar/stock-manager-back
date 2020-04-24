import { Router } from 'express'
import { env } from '../env'
import db from '../../models'
import { genError } from '../utils'

const router = Router()
const MSG = {
  RETRIEVE_SUCCES: 'stock retrieved',
  RETRIEVE_FAILED: 'stock retrieved failed',
  CREATE_SUCCESS: 'stock created',
}

const { Stock } = db

function getStockByUserId(req, res, next) {
  process.nextTick(() => {
    Stock.findAll({
      where: {
        userid: req.user.id,
      },
    })
      .then((stocks) => {
        res.stocks = stocks
        next()
      })
      .catch((err) => {
        next(genError(MSG.RETRIEVE_FAILED, err.message, env.HTTP_STATUS.SERVER_ERROR))
      })
  })
}

router.use((req, res, next) => {
  res.stocks = []
  next()
})

router.post('/', (req, res) => {
  process.nextTick(() => {
    const now = new Date()
    const newstock = {
      stockname: req.body.stockname,
      stockcode: req.body.stockcode,
      qty: req.body.qty,
      value: req.body.value,
      userid: req.user.id,
      createdAt: now,
      updatedAt: now,
    }
    Stock.create(newstock)
      .then((stock) => {
        res.status(env.HTTP_STATUS.OK)
          .json({
            message: MSG.CREATE_SUCCESS,
            stock,
          })
      })
      .catch((err) => {
        res.status(env.HTTP_STATUS.BAD_REQUEST)
          .json({
            message: 'error',
            error: err.message,
          })
      })
  })
})

router.get('/', getStockByUserId, (req, res) => {
  res.status(env.HTTP_STATUS.OK)
    .json({
      message: MSG.RETRIEVE_SUCCES,
      stocks: res.stocks,
    })
})

export default router
