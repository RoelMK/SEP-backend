const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));

module.exports = indexRouter;
