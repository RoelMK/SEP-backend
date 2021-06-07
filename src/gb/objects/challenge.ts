import { GameBusClient, Headers, Query } from "../gbClient";
import { ChallengeReference } from "../models/gamebusModel";
import FormData from 'form-data';
import { TokenHandler } from "../auth/tokenHandler";

export class Challenge {
    constructor(private readonly gamebus: GameBusClient, private readonly authRequired: boolean) {}

    /**
     * PUTs an activity using given data on given activity ID
     * @param data Activity data to replace current activity with
     * @param activityId Activity ID to replace
     */
     async putChallenge(
        data: ChallengeReference,
        challengeId: number,
        headers?: Headers,
        query?: Query
    ): Promise<unknown> {
        // PUT uses form-data, so we convert data to string and send as form data
        const body = new FormData();
        body.append('challenge', JSON.stringify(data));
        const formHeaders = body.getHeaders();

        // We have to create the headers here because FormData has some extra headers
        let gamebusHeaders = this.gamebus.createHeader(true, headers);
        gamebusHeaders = {
            ...gamebusHeaders,
            ...formHeaders
        };

        const response = await this.gamebus.post(
            'me/challenges',
            body,
            gamebusHeaders,
            { dryrun: 'false', ...query },
            true,
            false
        );
        return response;
    }
}

const repsonse1 : ChallengeReference = {
    "id": 2871,
    "name": "challenge name",
    "description": null,
    "image": null,
    "websiteURL": "https://www.google.com/",
    "maxCircleSize": 1,
    "minCircleSize": 1,
    "availableDate": 1622930400000,
    "startDate": 1623063600000,
    "endDate": 1625522399999,
    "rewardDescription": null,
    "rewardInfo": null,
    "challengeType": "PURE_TOP_X",
    "target": 0,
    "contenders": 1,
    "isPublic": false,
    "winnersAssigned": false,
    "renewAutomatically": false,
    "renewed": false,
    "withNudging": false,
    "creator": {
        "id": 524,
        "firstName": "Alexandra",
        "lastName": "Nikolova",
        "image": null,
        "player": {
            "id": 532
        }
    },
    "challengeRules": [
        {
            "id": 3119,
            "name": "rule 1",
            "description": null,
            "image": null,
            "imageRequired": false,
            "videoAllowed": null,
            "imageAllowed": null,
            "backendOnly": false,
            "maxTimesFired": 1,
            "minDaysBetweenFire": 0,
            "numberOfFiresInTimeWindow": 0,
            "conditions": [
                {
                    "id": 4251,
                    "rhsValue": "1",
                    "property": {
                        "id": 1,
                        "translationKey": "STEPS",
                        "baseUnit": "count",
                        "inputType": "INT",
                        "aggregationStrategy": "SUM",
                        "propertyPermissions": [
                            {
                                "id": 646,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 650,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 653,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 658,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 663,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 668,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 674,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 678,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 681,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 686,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 691,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 696,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 729,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 70,
                                    "translationKey": "WALK(DETAIL)",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": null
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 740,
                                "index": 0,
                                "lastUpdate": null,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 71,
                                    "translationKey": "RUN(DETAIL)",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": null
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 1258,
                                "index": null,
                                "lastUpdate": 1616660841000,
                                "decisionNote": null,
                                "state": "TESTING_ONLY",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 1259,
                                "index": null,
                                "lastUpdate": 1616660854000,
                                "decisionNote": null,
                                "state": "TESTING_ONLY",
                                "gameDescriptor": {
                                    "id": 2,
                                    "translationKey": "RUN",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 1264,
                                "index": null,
                                "lastUpdate": 1619419282000,
                                "decisionNote": null,
                                "state": "PUBLIC_APPROVED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            },
                            {
                                "id": 1303,
                                "index": null,
                                "lastUpdate": 1620823338000,
                                "decisionNote": null,
                                "state": "PUBLIC_REQUESTED",
                                "gameDescriptor": {
                                    "id": 1,
                                    "translationKey": "WALK",
                                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                                    "type": "PHYSICAL",
                                    "miniGames": [],
                                    "isAggregate": false
                                },
                                "allowedValues": []
                            }
                        ]
                    },
                    "operator": {
                        "id": 4,
                        "operator": "STRICTLY_GREATER"
                    }
                }
            ],
            "pointMappings": [],
            "restrictedGameDescriptors": [
                {
                    "id": 1,
                    "translationKey": "WALK",
                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                    "type": "PHYSICAL",
                    "miniGames": [],
                    "isAggregate": false
                },
                {
                    "id": 2,
                    "translationKey": "RUN",
                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/RUN.png",
                    "type": "PHYSICAL",
                    "miniGames": [],
                    "isAggregate": false
                },
                {
                    "id": 3,
                    "translationKey": "BIKE",
                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/BIKE.png",
                    "type": "PHYSICAL",
                    "miniGames": [],
                    "isAggregate": false
                },
                {
                    "id": 4,
                    "translationKey": "TRANSPORT",
                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/TRANSPORT.png",
                    "type": "PHYSICAL",
                    "miniGames": [],
                    "isAggregate": false
                },
                {
                    "id": 5,
                    "translationKey": "LOCATION",
                    "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/LOCATION.png",
                    "type": "SOCIAL",
                    "miniGames": [],
                    "isAggregate": false
                }
            ],
            "defaultGameDescriptor": {
                "id": 1,
                "translationKey": "WALK",
                "image": "https://api3.gamebus.eu/v2/uploads/public/brand/gd/icon/WALK.png",
                "type": "PHYSICAL",
                "miniGames": [],
                "isAggregate": false
            }
        }
    ],
    "participations": null,
    "showChallengeRights": [
        {
            "circle": {
                "id": 100784,
                "name": "Rinse Vlaswinkel",
                "image": null,
                "isPrivate": true,
                "memberships": [
                    {
                        "id": 809,
                        "state": "LEADERSHIP_APPROVED",
                        "player": {
                            "id": 526
                        }
                    }
                ]
            }
        }
    ],
    "rewards": null,
    "rewardConfig": [],
    "lottery": null
}


async function testGb() {
    const client = new GameBusClient(new TokenHandler("token", "token", "532"), true);
    const challenge = new Challenge(client,true);

    process.on('unhandledRejection', (reason: any, p: Promise<any>) => {
        console.log(`Unhandled rejection at: Promise ${JSON.stringify(p)}, reason: ${reason}`);
    });

    await challenge.putChallenge(repsonse1,102);
}

testGb()