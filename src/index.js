import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

const app = express();

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use('/', (req, res, next) => {
    res.status(200).json({
        message: `ok`
    });
});

app.listen(3003, () => {
    console.log('app listen at port 3003');
});