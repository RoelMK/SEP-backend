/* eslint-disable @typescript-eslint/no-var-requires */
const indexRouter = require('express').Router();

indexRouter.use('/', require('../../test/testRoutes.ts'));

// endpoints for getting onedrive data
indexRouter.use('/onedrive', require('./onedrive'));
// endpoints for authentication
indexRouter.use('/', require('./auth'));
// endpoints for uploading files
indexRouter.use('/', require('./upload'));
// endpoints for supervisor functionality
indexRouter.use('/supervisor', require('./supervisor'));
// endpoints for retrieving data
indexRouter.use('/', require('./data'));
// endpoints for retrieving dat from nightscout
indexRouter.use('/', require('./nightscout'));
// endpoints for receiving mood updates
indexRouter.use('/', require('./mood'));
// endpoints for receiving insulin updates
indexRouter.use('/', require('./insulin'));
// endpoints to perform actions on GameBus activities
indexRouter.use('/', require('./activity'));
// endpoint for posting and getting profile data
indexRouter.use('/', require('./profile'));
// endpoint to flush the database and add supervisors (can be used for testing purposes)
indexRouter.use('/', require('./flushDB'));

module.exports = indexRouter;
