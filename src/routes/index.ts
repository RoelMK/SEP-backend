const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));
indexRouter.use('/', require('./UploadCSV'));

module.exports = indexRouter;
