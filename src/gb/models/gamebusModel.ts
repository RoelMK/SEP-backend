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
    miniGames?: any[];
    isAggregate: boolean | null; //not sure if this is alway there
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

export interface GameBusUser {
    id: number; // user ID
    email: string;
    firstName: string;
    lastName: string;
    image: string | null; // null if no image
    registrationDate: number; // Unix timestamp in ms
    isActivated: boolean; // email verified
    language: string; // 'en' for English, 'nl' for Dutch
    player: {
        id: number; // player ID (as opposed to user ID)
    };
    notifications: Notification[];
}

export interface Notification {
    id: number; // Notification ID
    date: number; // Unix timestamp in ms
    translationKey: string;
    isRead: boolean;
    overrideImportance: null | boolean;
    params: NotificationParams[];
}

export interface NotificationParams {
    paramKey: string;
    paramValue: string | null;
}

//TODO add output interfaces for getPlayer and getUser

export interface PropertyPermissionsReference {
    id: number;
    index: any;
    lastUpdate: any;
    decisionNote: any;
    state: any;
    gameDescriptor: GameDescriptorReference;
    allowedValues: any[];
}

export interface CircleGETData {
    id: number;
    name: string;
    image: string | null;
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
    initiatorOfLeadership: UserReference | null; //not sure
}

export interface ChallengePOSTData {
    name: string;
    description: null | string;
    image: null | string;
    websiteURL: null | string;
    minCircleSize: number;
    maxCircleSize: number;
    availableDate: string | number;
    startDate: string | number;
    endDate: string | number;
    rewardDescription: any;
    rewardInfo: any;
    target: any;
    contenders: any;
    withNudging: any;
    rules: ChallengeRulesPOSTData[];
    circles: number[];
}

export interface ChallengeRulesPOSTData {
    id: any;
    name: string;
    image: string | null;
    imageRequired: boolean;
    gameDescriptors: any;
    maxTimesFired: any;
    minDaysBetweenFire: any;
    conditions: ChallengeConditionsPOSTData[];
    points: Points[];
}

export interface ChallengeConditionsPOSTData {
    property: number;
    operator: string;
    value: string;
}

export interface Points {
    dataProviders?: DataProviderReference;
}
