import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import body_parser from 'body-parser';

const { json, urlencoded } = body_parser;

import router from './src/router.js';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({extended: false}));
app.use(cookieParser());

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    err: (app.get('env') === 'development') ? err.message : {},
  });
});

export default app;
