/* eslint-disable @typescript-eslint/no-var-requires */
const moodRouter = require('express').Router();

moodRouter.post('/mood', (req: any, res: any) => {
    // Call someone to aggregate and send data to gamebus
    console.log(req.body);
    res.send(req.body);

    // TODO: wait for mood-post branch to be finished, then check for activityId to see whether to POST or PUT
});

module.exports = moodRouter;
