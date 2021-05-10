const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));
indexRouter.use('/onedrive', require('./onedrive'));

module.exports = indexRouter;
