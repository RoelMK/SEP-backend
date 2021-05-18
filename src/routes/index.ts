const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));

indexRouter.use('/onedrive', require('./onedrive'));
indexRouter.use('/', require('./auth'));
indexRouter.use('/', require('./uploadFiles'));

module.exports = indexRouter;
