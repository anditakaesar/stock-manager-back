import { Router } from 'express'

const router = Router()

router.use('/migration', require('./migrationRouter').default)

export default router
