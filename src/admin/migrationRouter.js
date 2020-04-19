import { Router } from 'express'
import Umzug from 'umzug'
import Sequelize from 'sequelize'
import { sequelize } from '../../models/index'
import { genError } from '../utils'

// /migration

const router = Router()
const migrationConfig = {
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize,
    ],
    path: './migrations',
  },
}

const umzug = new Umzug(migrationConfig)

router.use((req, res, next) => {
  res.migrations = []
  next()
})

function GetExecutedMigration(req, res, next) {
  process.nextTick(() => {
    umzug.executed()
      .then((mgtd) => {
        mgtd.forEach((m) => res.migrations.push({ name: m.file, type: 'migration', status: 'migrated' }))

        next()
      })
      .catch((err) => {
        next(genError('Error get executed migrations', err.message))
      })
  })
}

function GetPendingMigration(req, res, next) {
  process.nextTick(() => {
    umzug.pending()
      .then((pndg) => {
        pndg.forEach((m) => res.migrations.push({ name: m.file, type: 'migration', status: 'pending' }))

        next()
      })
      .catch((err) => {
        next(genError('Error get pending migrations', err.message))
      })
  })
}

router.get('/', GetExecutedMigration, GetPendingMigration, (req, res) => {
  res.status(200).json({
    message: 'all migrations',
    migrations: res.migrations,
  })
})

router.post('/up', (req, res, next) => {
  process.nextTick(() => {
    umzug.execute({
      migrations: req.body.migrations,
      method: 'up',
    })
      .then((mgtns) => {
        const migrations = []
        mgtns.forEach((m) => migrations.push(m.file))

        res.status(200).json({
          message: 'migrated',
          migrations,
        })
      })
      .catch((err) => {
        next(genError('error migrating', err.message))
      })
  })
})

router.post('/down', (req, res, next) => {
  process.nextTick(() => {
    umzug.execute({
      migrations: req.body.migrations,
      method: 'down',
    })
      .then((mgtns) => {
        const migrations = []
        mgtns.forEach((m) => migrations.push(m.file))

        res.status(200).json({
          message: 'undo migrated',
          migrations,
        })
      })
      .catch((err) => {
        next(genError('error undo migration', err.message))
      })
  })
})

export default router
