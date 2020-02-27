import { Router } from 'express';
import Umzug from 'umzug';
import sequelize from '../dbconn';
import { genError } from '../utils';
import Sequelize from 'sequelize';

// /migration

const router = Router();
const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    },

    migrations: {
        params: [
            sequelize.getQueryInterface(),
            Sequelize
        ],
        path: './migrations'
    },
})

router.get('/', GetExecutedMigration, GetPendingMigration, (req, res, next) => {
    res.status(200).json({
        message: `all migrations`,
        migrations: res.migrations
    });
});

router.post('/up', (req, res, next) => {
    process.nextTick(() => {
        umzug.execute({
            migrations: req.body.migrations,
            method: 'up'
        })
        .then(mgtns => {
            let migrations = [];
            mgtns.forEach(m => migrations.push(m.file));

            res.status(200).json({
                message: `migrated`,
                migrations: migrations
            });
        })
        .catch(err => {
            next(genError(`error migrating`, err.message));
        });
    });
});

router.post('/down', (req, res, next) => {
    process.nextTick(() => {
        umzug.execute({
            migrations: req.body.migrations,
            method: 'down'
        })
        .then(mgtns => {
            let migrations = [];
            mgtns.forEach(m => migrations.push(m.file));

            res.status(200).json({
                message: `undo migrated`,
                migrations: migrations
            });
        })
        .catch(err => {
            next(genError(`error undo migration`, err.message));
        });
    });
});

function GetExecutedMigration (req, res, next) {
    process.nextTick(() => {
        umzug.executed()
        .then(mgtd => {
            let migrations = res.migrations ? [...res.migrations] : [];
            
            mgtd.forEach(m => migrations.push({ name: m.file, status: 'migrated' }));
            res.migrations = migrations;

            next();
        })
        .catch(err => {
            next(genError(`Error get executed migrations`, err.message));
        });
    });
}

function GetPendingMigration (req, res, next) {
    process.nextTick(() => {
        umzug.pending()
        .then(pndg => {
            let migrations = res.migrations ? [...res.migrations] : [];

            pndg.forEach(m => migrations.push({ name: m.file, status: 'pending' }));
            res.migrations = migrations;

            next();
        })
        .catch(err => {
            next(genError(`Error get pending migrations`, err.message));
        });
    });
}

export default router;