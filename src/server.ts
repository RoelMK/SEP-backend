/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import express from 'express';
const errorhandler = require('errorhandler');
const cors = require('cors');
import { DBClient } from './db/dbClient';
const fs = require('fs');
const http = require('http');
const https = require('https');

const isProduction = process.env.NODE_ENV === 'production';

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

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

// Needed for POSTing
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());
app.use(cors({
    methods: true,
    credentials: true,
    exposedHeaders: ['x-access-token', 'Authorization', 'Content-Type'],
    origin: true
    })
);

// ---- Do not add routes above this line! ----
app.use(require('./routes'));
if (!isProduction) {
    app.use(errorhandler());
}

// Launch
/*export const server = app.listen(port, () => {
    console.log('Listening on port ' + port);
});*/
//const httpServer = http.createServer(app);

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port ' + port);
});