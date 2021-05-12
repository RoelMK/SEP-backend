const indexRouter = require('express').Router();

indexRouter.use('/', require('./test'));
indexRouter.use('/', require('./UploadFiles'));

module.exports = indexRouter;
