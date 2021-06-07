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

export interface IDActivityPOSTData {
    gameDescriptor: number;
    dataProvider: number;
    image?: string;
    date: number;
    propertyInstances: IDPropertyInstancePOST[];
    players: number[];
}

export interface IDPropertyInstancePOST {
    property: number;
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
    value: string; // still not sure about this one
    property: PropertyInstanceProperty;
}

export interface PropertyInstanceProperty {
    id: number;
    translationKey: string;
    baseUnit: string;
    inputType: string;
    aggregationStrategy: string;
    propertyPermissions: PropertyPermissionsReference[]; // Probably not needed
}

export interface SupportReference {
    id: number;
    date: number;
    supporter: UserReference;
}

//TODO add output interfaces for getPlayer and getUser


export interface ChallengeReference {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    websiteURL: string | null;
    maxCircleSize: any;
    minCircleSize: any;
    availableDate: number;
    startDate: number;
    endDate: number;
    rewardDescription: any;
    rewardInfo: any;
    challengeType: any;
    target: any;
    contenders: any;
    isPublic: any;
    winnersAssigned: any;
    renewAutomatically: any;
    renewed: any;
    withNudging: any;
    creator: UserReference;
    challengeRules: ChallengeRules[];

}

export interface ChallengeRules {
    id:number;
    name: string;
    description: null | string;
    image: any;
    imageRequired: any;
    videoAllowed: any;
    imageAllowed: any;
    backendOnly: any;
    maxTimesFired: any;
    minDaysBetweenFire: any;
    numberOfFiresInTimeWindow: any;
    conditions: ConditionsReference[];
    participations:any;
    showChallengeRights: ChallengeRightsReference[];
    rewards: any;
    rewardConfig: any[];
    lottery:any;
}

export interface ConditionsReference{
    id: number;
    rhsValue: any;
    property: PropertyInstanceProperty;
}

export interface PropertyPermissionsReference{
    id: number;
    index: any;
    lastUpdate: number;
    decisionNote: any;
    state: any;
    gameDescriptor: GameDescriptorReference;
    allowedValues: any[];
}

export interface ChallengeRightsReference{
    circle: CircleReference;
}
export interface CircleReference{
    id: number;
    name: string | null;
    image: string | null;
    isPrivate: any;
    memberships: ChallengeMembership[];
}

export interface ChallengeMembership{
    id:number;
    state: string;
    player: PlayerReference;
}

export interface PlayerReference{
    id:number;
}

export interface CircleGETData {
    id: number;
    name: string;
    image: string | null ;
    type: string;
    description: string;
    isPrivate: boolean;
    removed: boolean;
    leadersCanLogActivities: boolean;
    leadersCanSignUpPlayers: boolean;
    autoAcceptMembershipRequests: boolean;
    displayPersonalPointsToCircleMembersInMutualChallenges: boolean;
    displayPersonalPointsToCircleMembers: boolean;
    withNudging: boolean;
    creator: UserReference;
    memberships: MembershipReference[]; 
    participations: any[];
    showChallengeRights: any[];
    chats: any[];
}

export interface MembershipReference {
    id: number;
    state: string;
    player: UserReference;
    initiatorOfMembership: UserReference;
    initiatorOfLeadership: UserReference| null; //not sure
}
