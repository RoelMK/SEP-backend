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
indexRouter.use('/.well-known/acme-challenge/lX3DEZfFchxrG_xfG_2rPOUefvmYLmxYw9EJlQtVQ1k', (req: any, res: any) => {
    res.status(200).send('lX3DEZfFchxrG_xfG_2rPOUefvmYLmxYw9EJlQtVQ1k.mQvT2UanQpUOo6C2OCOVh17S8l2ZOCtz7X2cJtIM7fo');
});

module.exports = indexRouter;
