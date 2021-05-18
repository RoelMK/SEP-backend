export interface ConnectionData {
    authToken: string;
    playerID: number;
    userID: number;
}

export interface ActivityPOSTData {
    gameDescriptorTK: string;
    dataProviderName: string;
    image: string;
    date: number;
    propertyInstances: PropertyInstancePOST[];
    players: number[];
}

export interface PropertyInstancePOST {
    propertyTK: string;
    value: any;
}

export interface ActivityGETData {
    id: number;
    date: number;
    isManual: boolean;
    group?: any; //unkown yet
    image?: any; //unkown yet
    creator: UserReference;
    player: UserReference;
    gameDescriptor: GameDescriptorReference;
    dataProvider: DataProviderReference;
    propertyInstances: PropertyInstanceReference[];
    personalPoints: any[]; //TODO, no idea
    supports: SupportReference[];
    chats: any[]; //TODO, prob not going to use anyways
}

export interface UserReference {
    id: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        image: string | null;
    };
}

export interface GameDescriptorReference {
    id: number;
    translationKey: string;
    image: string | null;
    type: string; //not sure if this is always there
    isAggregate: boolean; //not sure if this is alway there
}

export interface DataProviderReference {
    id: number;
    name: string;
    image: string | null;
    isConnected: boolean; //not sure if this is always there
}

export interface PropertyInstanceReference {
    id: number;
    value: number; //TODO, check this!!
    property: PropertyInstanceProperty;
}

export interface PropertyInstanceProperty {
    id: number;
    translationKey: string;
    baseUnit: string;
    inputType: string;
    aggregationStrategy: string;
    properyPermissions: any[]; // Probably not needed
}

export interface SupportReference {
    id: number;
    date: number;
    supporter: UserReference;
}

//TODO add output interfaces for getPlayer and getUser
