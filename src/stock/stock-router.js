import { Router } from 'express'
import { env } from '../env'
import db from '../../models'
import { genError } from '../utils'

const router = Router()
const MSG = {
  RETRIEVE_SUCCESS: 'stock retrieved',
  RETRIEVE_FAILED: 'stock retrieved failed',
  CREATE_SUCCESS: 'stock created',
  CREATE_FAILED: 'failed to create stock',
  UPDATE_SUCCESS: 'stock updated',
  UPDATE_FAILED: 'failed to update stock',
  DELETE_SUCCESS: 'stock deleted',
  DELETE_FAILED: 'failed to delete stock',
  NOT_FOUND: 'stock not found',
  BODY_REQUIRED: 'stockname and stockcode required',
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

function checkBodyRequirement(req, res, next) {
  if ((req.body.stockname === undefined) || (req.body.stockcode === undefined)) {
    next(genError(MSG.CREATE_FAILED, MSG.BODY_REQUIRED, env.HTTP_STATUS.BAD_REQUEST))
  } else {
    next()
  }
}

function getStock(req, res, next) {
  process.nextTick(() => {
    Stock.findOne({
      where: {
        id: req.params.id,
        userid: req.user.id,
      },
    })
      .then((stock) => {
        if (stock !== null) {
          res.stock = stock
          next()
        } else {
          next(genError(MSG.RETRIEVE_FAILED, 'stock not found', env.HTTP_STATUS.NOT_FOUND))
        }
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

router.post('/', checkBodyRequirement, (req, res, next) => {
  process.nextTick(() => {
    const now = new Date()
    const newstock = {
      stockname: req.body.stockname,
      stockcode: req.body.stockcode,
      qty: req.body.qty ? req.body.qty : 0,
      value: req.body.value ? req.body.value : 0,
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
        next(genError(MSG.CREATE_FAILED, err.message))
      })
  })
})

router.get('/', getStockByUserId, (req, res) => {
  res.status(env.HTTP_STATUS.OK)
    .json({
      message: MSG.RETRIEVE_SUCCESS,
      stocks: res.stocks,
    })
})

router.get('/:id', getStock, (req, res) => {
  res.status(env.HTTP_STATUS.OK)
    .json({
      message: MSG.RETRIEVE_SUCCESS,
      stock: res.stock,
    })
})

router.put('/:id', getStock, (req, res, next) => {
  process.nextTick(() => {
    const updatedStock = {
      stockname: req.body.stockname ? req.body.stockname : res.stock.stockname,
      stockcode: req.body.stockcode ? req.body.stockcode : res.stock.stockcode,
      qty: req.body.qty ? req.body.qty : res.stock.qty,
      value: req.body.value ? req.body.value : res.stock.value,
      userid: res.stock.userid,
      createdAt: res.stock.createdAt,
      updatedAt: new Date(),
    }

    Stock.update(updatedStock, {
      where: {
        userid: req.user.id,
        id: req.params.id,
      },
    })
      .then((len) => {
        if (len > 0) {
          res.status(env.HTTP_STATUS.OK)
            .json({
              message: MSG.UPDATE_SUCCESS,
              stock: updatedStock,
            })
        } else {
          next(genError(MSG.UPDATE_FAILED, 'stock not found', env.HTTP_STATUS.NOT_FOUND))
        }
      })
      .catch((err) => {
        next(genError(MSG.UPDATE_FAILED, err.message, env.HTTP_STATUS.SERVER_ERROR))
      })
  })
})

router.delete('/:id', getStock, (req, res, next) => {
  if (res.stock !== null && res.stock !== undefined) {
    process.nextTick(() => {
      Stock.destroy({
        where: {
          id: res.stock.id,
        },
      })
        .then((len) => {
          if (len > 0) {
            res.status(env.HTTP_STATUS.OK)
              .json({
                message: MSG.DELETE_SUCCESS,
                stock: res.stock,
              })
          } else {
            next(genError(MSG.NOT_FOUND, '', env.HTTP_STATUS.NOT_FOUND))
          }
        })
        .catch((err) => {
          next(genError(MSG.DELETE_FAILED, err.message, env.HTTP_STATUS.SERVER_ERROR))
        })
    })
  }
})

export default router
