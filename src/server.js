import express from 'express';
import 'express-async-errors';
import BodyParser from 'body-parser';
import cors from 'cors';
import logSymbols from 'log-symbols';
import mongoose from 'mongoose';
/* import cookieSession from 'cookie-session'; */
import { errorHandler } from './middlewares/error-handler';
import { CustomError, NotFoundError } from './errors';
import { AuthRouter, signoutRouter } from './routes/v1/';
import { Config } from './config';
import  logger  from './utils/logger';
import httpLogger from './utils/http-logger';

// initialize Express App
const app = express();
const { json } = BodyParser;
app.options('*', cors())
app.set('trust proxy', true);
app.use(json());
app.use(httpLogger);

// CORS config
app.use(function(req, res, next) {
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/* app.use(
  cookieSession({
    signed: false,
    secure: true
  })
); */

/* app.use(express.static('public')); */

// Use Defined routes by express

app.use(AuthRouter);
app.use(signoutRouter);
app.get("/", (req, res) => {
  res.json({ message: `Gurulytics API`});
});

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  
  if (!Config.DB_URI) {
    throw new Error('DB URI must be defined');
  }

  if (!Config.PORT) {
    throw new Error('PORT must be defined');
  }

  try {
    await mongoose.connect(Config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info(`${logSymbols.success} The database is connected to ${Config.ENV}. ${logSymbols.success}`);
  } catch (err) {
    logger.error( `${logSymbols.error} The database connection to ${Config.ENV} failed. ${logSymbols.error}`);
    throw new CustomError(err)
  }

  app.listen(Config.PORT, () => {
    logger.info(`${logSymbols.success} Gurulytics ${Config.ENV} API @ port ${Config.PORT}!. ${logSymbols.success}`);
  });
};

start();
