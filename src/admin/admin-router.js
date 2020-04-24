import { Router } from 'express'

const router = Router()

router.use('/migration', require('./migration-router').default)

export default router
