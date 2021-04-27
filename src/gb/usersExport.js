const dotenv = require('dotenv')
dotenv.config()


let userKevin = {
    authToken : process.env.kevin_authtoken,
    playerID : process.env.kevin_playerID,
    userID : process.env.kevin_userID
}
let userKevin2 = {
    authToken : process.env.kevin2_authtoken,
    playerID : process.env.kevin2_playerID,
    userID : process.env.kevin2_userID
}

module.exports = {
    userKevin : userKevin,
    userKevin2 : userKevin2
}