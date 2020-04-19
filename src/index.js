import 'dotenv/config'
import application from './app'
import { env } from './env'
import logger from './logger'

application.app.listen(env.PORT, () => {
  logger.info(`App listen at port ${env.PORT}`)
})
