/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express from 'express';
const errorhandler = require('errorhandler');
const cors = require('cors');
import { DBClient } from './db/dbClient';

const isProduction = process.env.NODE_ENV === 'production';

// Initialize database
const dbClient: DBClient = new DBClient();
dbClient.initialize();
dbClient.close();


// Create app object
const app = express();
let port = 8080;
if (process.env.PORT) {
    port = Number(process.env.PORT);
}

app.use(express.json());
app.use(cors());

// ---- Do not add routes above this line! ----
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
export const server = app.listen(port, () => {
    console.log('Listening on port ' + port + ' http://localhost:8080');
});
