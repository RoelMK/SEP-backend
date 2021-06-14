import { TokenHandler } from "./gb/auth/tokenHandler";
import { GameBusClient } from "./gb/gbClient";
import { userKevin } from "./gb/usersExport";

let client : GameBusClient = new GameBusClient(new TokenHandler(userKevin.authToken,"",String(userKevin.playerID)))

async function name() {
    console.log("start")
    let x = await client.activity().deleteActivityById(27151);
    console.log(x)
    console.log("end")
}
//name()
async function name2() {
    let x = await client.activity().getActivityById(27151);
    console.log(x)
}

name2()