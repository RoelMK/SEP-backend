const https = require('https')

console.log("Starting")
let authToken = "436a116e-6814-409a-8afc-0be7a2e34711"
let playerID = 524

let onComplete = function (data) {
    let x = JSON.parse(data)
    console.log(x)
    //console.log(x[0].propertyInstances)
    //console.log(x[0].propertyInstances[0].property.propertyPermissions)
}

testGamebarGetActivities(playerID, authToken, onComplete)

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

function testGamebarGetActivities(playerID, authToken, onComplete) {
    const options = {
        hostname : 'api3.gamebus.eu',
        path: '/v2/players/'+playerID+'/activities', 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }
    
    console.log("Looking for " + options.hostname)
    console.log()
    
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
            onComplete(data)
        })
    })
    
    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}

/*
    https://dzone.com/articles/nodejs-call-https-basic
*/