const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));
indexRouter.use('/', require('./uploadFiles'));

module.exports = indexRouter;
