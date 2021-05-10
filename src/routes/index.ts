const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));
indexRouter.use('/', require('./auth'));

module.exports = indexRouter;
