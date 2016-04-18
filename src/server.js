import config from './config/config';

import express from 'express';
import mongoose from 'mongoose';

import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import routes from './routes';
import middlewares from './middlewares';

const port = config.PORT;
const app = express();

require('./libraries/promisify-all')(['mongoose', 'jsonwebtoken', 'bcrypt']);

mongoose.connect(config.MONGODB_URL);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('tiny'));

// @TODO: fix middlewares.cors call, default shouldn't be needed
app.use(middlewares.cors.default);
app.use('/', routes);

app.listen(port);
console.log(`Magic happens on port ${port}`); // eslint-disable-line no-console

module.exports = app;
