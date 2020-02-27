import Sequelize from 'sequelize';
import logger from './logger';

// sqlite3 database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
    logging: false,
    sync: { force: false } // do not force sync, use migration instead
});

// check database connection
sequelize
.authenticate()
.then(() => {
    logger.info(`database connected!`);
})
.catch(err => {
    logger.error(`database connection error`, { err: err.message })
});

export default sequelize;