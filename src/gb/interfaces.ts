export interface connectionData {
    authToken : string,
    playerID : number,
    userID : number
}

export interface  activityPOSTData {
    gameDescriptorTK : String,
    dataProviderName : String,
    image : String | null
    date : number,
    propertyInstances : propertyInstancePOST[]
    players : number[]
}

export interface propertyInstancePOST {
    "propertyTK" : string,
    "value" : any
}

export interface activityGETData {
    id : number,
    date : number,
    isManual : boolean,
    group? : any //unkown yet
    image? : any //unkown yet
    creator : userReference
    player : userReference
    gameDescriptor : gameDescriptorReference
    dataProvider : dataProviderReference
    propertyInstances : propertyInstanceReference[]
    personalPoints : any[] //TODO, no idea
    supports : supportReference[]
    chats : any[] //TODO, prob not going to use anyways
}

export interface userReference {
    id :  number
    user : {
        id : number
        firstName : string
        lastName : string
        image : string | null
    }
}

export interface gameDescriptorReference {
    id : number,
    translationKey : string,
    image : string | null,
    type : string //not sure if this is always there
    isAggregate : boolean //not sure if this is alway there
}

export interface dataProviderReference {
    id : number
    name : string,
    image : string | null,
    isConnected : boolean //not sure if this is always there
}

export interface propertyInstanceReference {
    id : number,
    value : number //TODO, check this!!
    property : {
        id : number
        translationKey :  string
        baseUnit :  string
        inputType : string
        aggregationStrategy : string
        properyPermissions: any[] //
    }
}

export interface supportReference {
    id : number,
    date : number,
    supporter : userReference
}

//TODO add output interfaces for getPlayer and getUser