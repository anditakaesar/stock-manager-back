import 'dotenv/config';
import { http } from './app';
import { env } from './env';
import logger from './logger';

http.listen(env.PORT, () => {
    logger.info(`App listen at port ${env.PORT}`);
});