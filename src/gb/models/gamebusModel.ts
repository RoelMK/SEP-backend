export interface ConnectionData {
    authToken: string;
    playerID: number;
    userID: number;
}

// Interface for activity POST
export interface ActivityPOSTData {
    gameDescriptorTK: string; // Translation key of game descriptor
    dataProviderName: string; // Name of data provider
    image: string | null; // Image URL (optional)
    date: number; // Unix timestamp
    propertyInstances: PropertyInstancePOST[]; // Property instances
    players: number[]; // Array of player IDs
}

// Interface for activity POST properties
export interface PropertyInstancePOST {
    propertyTK: string; // Property translation key
    value: any; // Value of property
}

// Interface for activity POST using IDs
export interface IDActivityPOSTData {
    gameDescriptor: number; // Game descriptor ID
    dataProvider: number; // Data provider ID
    image?: string | null; // Image URL (optional)
    date: number; // Unix timestamp
    propertyInstances: IDPropertyInstancePOST[]; // Property instances
    players: number[]; // Array of player IDs
}

// Interface for activity POST properties using IDs
export interface IDPropertyInstancePOST {
    property: number; // Property ID
    value: any; // Value of property
}

// Interface for activity GET
export interface ActivityGETData {
    id: number; // Activity ID
    date: number; // Unix timestamp
    isManual: boolean; // Entered manually
    group?: any; // Circles
    image?: string | null; // Image URL
    creator: UserReference; // Creator of activity
    player: UserReference; // Player of activity
    gameDescriptor: GameDescriptorReference; // Game descriptor
    dataProvider: DataProviderReference; // Data provider
    propertyInstances: PropertyInstanceReference[]; // Properties
    personalPoints: any[]; // Points earned
    supports: SupportReference[];
    chats: any[];
}

// Interface for GameBus user
export interface UserReference {
    id: number; // Player ID
    user: {
        id: number; // User ID
        firstName: string; // User first name
        lastName: string; // User last name
        image: string | null; // User profile picture
    };
}

// Interface for GameBus game descriptor
export interface GameDescriptorReference {
    id: number; // Game descriptor ID
    translationKey: string; // Game descriptor translation key
    image: string | null; // Game descriptor image
    type: string; // Type of game descriptor
    miniGames?: any[];
    isAggregate: boolean | null; //not sure if this is alway there
}

// Interface for GameBus data provider
export interface DataProviderReference {
    id: number; // Data provider ID
    name: string; // Data provider name
    image: string | null; // Data provider image
    isConnected: boolean; // Whether the data provider is
}

// Interface for property instance
export interface PropertyInstanceReference {
    id: number; // ID of property in activity
    value: string; // Property value
    property: PropertyInstanceProperty; // Reference to property
}

// Interface for property instance reference
export interface PropertyInstanceProperty {
    id: number; // Property ID
    translationKey: string; // Property translation key
    baseUnit: string; // Property base unit
    inputType: string; // Property input type (STRING, INT, DOUBLE)
    aggregationStrategy: string; // Property aggregation
    propertyPermissions: PropertyPermissionsReference[];
}

export interface SupportReference {
    id: number;
    date: number;
    supporter: UserReference;
}

// Interface for GameBus user on /users endpoint
export interface GameBusUser {
    id: number; // User ID
    email: string;
    firstName: string;
    lastName: string;
    image: string | null; // Null if no image
    registrationDate: number; // Unix timestamp
    isActivated: boolean; // Email verified
    language: string; // 'en' for English, 'nl' for Dutch
    player: {
        id: number; // Player ID (as opposed to user ID)
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

// Interface for property permissions (unused)
export interface PropertyPermissionsReference {
    id: number;
    index: any;
    lastUpdate: any;
    decisionNote: any;
    state: any;
    gameDescriptor: GameDescriptorReference;
    allowedValues: any[];
}

// Interface for circles
export interface CircleGETData {
    id: number; // Circle ID
    name: string; // Circle name
    image: string | null; // Circle image
    type: string; // Circle type
    description: string; // Circle description
    isPrivate: boolean; // Whether the circle is private
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

// Interface for circle members
export interface MembershipReference {
    id: number; // Player ID
    state: string;
    player: UserReference; // Reference to user
    initiatorOfMembership: UserReference;
    initiatorOfLeadership: UserReference | null;
}

// Interface for challenge POST
export interface ChallengePOSTData {
    name: string; // Name of challenge
    description: null | string; // Description of challenge
    image: null | string; // Image of challenge
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
    circles: number[]; // Reference to circle IDs the challenge is posted in
}

// Interface for challenge rules (POST)
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
