import { Router } from 'express';
import { DBClient } from '../db/dbClient';
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
    res.status(200).send('Db flushed');
});

module.exports = router;
