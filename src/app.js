import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import logger from './logger';

const app = express();
export const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

require('./dbconn');

io.on('connect', (socket) => {
    logger.info('a client connected');
    socket.on('disconnect', () => {
        logger.info('a client disconnected');
    });
});

// global middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// router
app.use('/admin', require('./admin/adminRouter').default);

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: `hello express`
    });
});

// end point for error handling
app.use((err, req, res, next) => {
    if (err) {
        if (!err.status) err.status = 500;

        logger.error(err.message, {
            request: `${req.method} ${req.originalUrl}`,
            intmsg: err.intmsg
        });
        
        res.status(err.status).json({
            message: err.message
        });
    }
});