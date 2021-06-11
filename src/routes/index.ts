/* eslint-disable @typescript-eslint/no-var-requires */
const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));

indexRouter.use('/onedrive', require('./onedrive'));
indexRouter.use('/', require('./auth'));
indexRouter.use('/', require('./upload'));
indexRouter.use('/supervisor', require('./supervisor'));

module.exports = indexRouter;
