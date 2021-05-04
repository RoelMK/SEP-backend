import { DBClient } from "./db/dbClient";

require('dotenv').config({ path: __dirname.split('\\').slice( 0, -1 ).join('\\') + '\\.env.local' });
const express = require('express');
const errorhandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';

// Initialize database
const dbClient: DBClient = new DBClient();
dbClient.initialize();
dbClient.close();

// Create app object
const app = express();
const port = 8080;
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
const server = app.listen(port, () => {
    console.log('Listening on port ' + server.address().port);
});
