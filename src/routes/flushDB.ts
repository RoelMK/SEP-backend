import { Router } from 'express';
import { DBClient } from '../db/dbClient';
import { request } from '../utils/supervisorUtils';
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const router = Router();

/**
 * flushdb
 */
router.post('/flushDB', function (req: any, res) {
    console.log('Cleaning database...');
    const dbClient = new DBClient();
    dbClient.reset();
    dbClient.close();

    request('atp@supervisor2.nl', 'atp@user.nl', false);
    request('atp@supervisor.nl', 'atp@user.nl', false);
    request('atp@supervisor.nl', 'atp@user.nl', true);

    res.status(200).send('Db flushed');
});

module.exports = router;
