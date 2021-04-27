"use strict";
// Example file on how to use this setup
/*
import { GameBusClient } from './GameBusClient';
// Make sure you have a (valid) API token in .env.local
require('dotenv').config({ path: './env.local' });
const token = process.env.TEST_TOKEN;

async function main() {
    const gamebus = new GameBusClient(true, token);
    const activity = await gamebus.activity().getActivityById(0);
    console.log(JSON.stringify(activity));
}

main();
*/
exports.__esModule = true;
var https = require('https');
var _a = require('./usersExport'), userKevin = _a.userKevin, userKevin2 = _a.userKevin2;
var kevin = userKevin;
var kevin2 = userKevin2;
testGamebarGetActivities(kevin, function (data) { return console.log(data); });
//testGamebarGetSingleActivity(26940,kevin,data => console.log(data))
//testGamebarGetSingleUser(kevin,data=>console.log(data))//TODO: nullpointer
//testGamebarGetSinglePlayer(kevin,data=>console.log(data))
function testHttps() {
    var options = {
        hostname: 'yurakidb.web.app',
        //hostname: '8.8.8.8',
        //port: 443,
        //path: '/',
        method: 'GET'
    };
    console.log("Looking for " + options.hostname);
    console.log();
    var req = https.request(options, function (res) {
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
function testGamebarGetActivities(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID + '/activities',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
function testGamebarGetSingleActivity(activityID, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/activities/' + activityID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO: disfunctional!! (nullpointer), TODO: remove any from onComplete
function testGamebarGetSingleUser(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/users/' + user.userID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO remove any from onComplete
function testGamebarGetSinglePlayer(user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/players/' + user.playerID,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log();
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.error(error);
    });
    req.end();
}
//TODO remove any from onComplete
function testGamebarPostActivity(activity, user, onComplete) {
    var options = {
        hostname: 'api3.gamebus.eu',
        path: '/v2/me/activities',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + user.authToken,
            'Content-Type': 'application/json'
        }
    };
    console.log("Looking for " + options.hostname + options.path);
    var req = https.request(options, function (res) {
        var data = '';
        var counter = 0;
        console.log("statusCode: " + res.statusCode);
        console.log("statusMessage: " + res.statusMessage);
        res.on('data', function (d) {
            data = data + d;
            counter++;
            console.log("Chunk number: " + counter);
        });
        res.on('end', function () {
            console.log("Succes");
            var x = JSON.parse(data);
            onComplete(x);
        });
    });
    req.on('error', function (error) {
        console.log("Error");
        console.error(error);
        console.error(error.name);
        console.error(error.message);
    });
    req.write(activity);
    req.end();
}
