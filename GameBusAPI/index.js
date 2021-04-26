const https = require('https')
const util = require('util')

//kevins credential (DON'T MISUSE!)
let userKevin2 = {
    authToken : "50a47c89-5cbd-4dca-aea9-e5d7ed93e837",
    playerID : 525,
    userID : 517
}

let activityID = 26940

let onComplete = function (data) {
    //console.log(data)
    console.log(util.inspect(data, false, null, true /* enable colors */))
}
let userKevin = {
    authToken : "436a116e-6814-409a-8afc-0be7a2e34711",
    playerID : 524,
    userID : 516
}
let newGFitActivity = {
    "gameDescriptorTK" : "WALK",
    "dataProviderName" : "Google Fit",
    "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Black_x.svg/525px-Black_x.svg.png",
    "date" : 1619355003,
    "propertyInstances" : [ {
        "propertyTK" : "STEPS",
        "value" : 42
    } ],
    "players" : [ userKevin.playerID ]
}

let newActivity = {
    "gameDescriptorTK" : "WALK",
    "dataProviderName" : "Daily_run",
    "image" : "http://kowedes.nl/gb/mock/activities/run-together.jpg",
    "date" : 1619090468664,
    "propertyInstances" : [ {
        "propertyTK" : "STEPS",
        "value" : 200
    } ],
    "players" : [ userKevin.playerID ]
}
let jsonAct = JSON.stringify(newGFitActivity)
//let jsonAct = JSON.stringify(newActivity)
testGamebarPostActivity(jsonAct,userKevin,onComplete)
//testHttps()
//testGamebarGetActivities(userKevin1, onComplete)
//testGamebarGetSingleActivity(activityID,userKevin,onComplete)
//testGamebarGetSingleUser(userKevin,onComplete) //DEFUNCT
//testGamebarGetSinglePlayer(userKevin, onComplete)




function testHttps () { //yurakiDB
    const options = {
        hostname : 'yurakidb.web.app',
        //hostname: '8.8.8.8',
        //port: 443,
        //path: '/',
        method: 'GET'
      }
      
      console.log("Looking for " + options.hostname)
      console.log()
      
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        res.on('data', d => {
          process.stdout.write(d)
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
}

function testGamebarGetActivities(user, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/players/'+user.playerID+'/activities', 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    }
    
    console.log("Looking for " + options.hostname + options.path)    
    const req = https.request(options, res => {
        let data = '';
        let counter = 0;
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            data = data + d;
            counter++;

            console.log("Chunk number: " + counter)
        })
        res.on('end', () => {
            console.log()
            let x = JSON.parse(data)
            onComplete(x)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}

function testGamebarGetSingleActivity(activityID, user, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/activities/'+activityID, 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    }
    
    console.log("Looking for " + options.hostname + options.path)    
    const req = https.request(options, res => {
        let data = '';
        let counter = 0;
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            data = data + d;
            counter++;

            console.log("Chunk number: " + counter)
        })
        res.on('end', () => {
            console.log()
            let x = JSON.parse(data)
            onComplete(x)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}

//TODO: disfunctional!! (nullpointer)
function testGamebarGetSingleUser(user, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/users/'+user.userID, 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    }
    
    console.log("Looking for " + options.hostname + options.path)    
    const req = https.request(options, res => {
        let data = '';
        let counter = 0;
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            data = data + d;
            counter++;

            console.log("Chunk number: " + counter)
        })
        res.on('end', () => {
            console.log()
            let x = JSON.parse(data)
            onComplete(x)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}

function testGamebarGetSinglePlayer(user, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/players/'+user.playerID, 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + user.authToken
        }
    }
    
    console.log("Looking for " + options.hostname + options.path)    
    const req = https.request(options, res => {
        let data = '';
        let counter = 0;
        console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d => {
            data = data + d;
            counter++;

            console.log("Chunk number: " + counter)
        })
        res.on('end', () => {
            console.log()
            let x = JSON.parse(data)
            onComplete(x)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}

function testGamebarPostActivity(activity, user, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/me/activities', 
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + user.authToken,
            'Content-Type': 'application/json'
        },
    }
    console.log("Looking for " + options.hostname + options.path)    
    const req = https.request(options, res => {
        let data = '';
        let counter = 0;
        console.log(`statusCode: ${res.statusCode}`)
        console.log(`statusMessage: ${res.statusMessage}`)
        res.on('data', d => {
            data = data + d;
            counter++;

            console.log("Chunk number: " + counter)
        })
        res.on('end', () => {
            console.log("Succes")
            let x = JSON.parse(data)
            onComplete(x)
        })
    })
    req.on('error', error => {
        console.log("Error")
        console.error(error)
        console.error(error.name)
        console.error(error.message)
    })
    req.write(activity)
    req.end()
}

function testPostV2 () {
    
}
/*
    https://dzone.com/articles/nodejs-call-https-basic
*/