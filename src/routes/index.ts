/* eslint-disable @typescript-eslint/no-var-requires */
const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));

indexRouter.use('/onedrive', require('./onedrive'));
indexRouter.use('/', require('./auth'));
indexRouter.use('/', require('./upload'));
indexRouter.use('/supervisor', require('./supervisor'));
indexRouter.use('/', require('./data'));
indexRouter.use('/', require('./nightscout'));
indexRouter.use('/', require('./mood'));
indexRouter.use('/', require('./insulin'));
indexRouter.use('/', require('./activity'));
indexRouter.use('/', require('./profile'));

module.exports = indexRouter;
