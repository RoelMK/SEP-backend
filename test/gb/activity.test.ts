/* eslint-disable max-len */
import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { QueryOrder } from '../../src/gb/objects/activity';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

const endpoint: string = process.env.ENDPOINT!;

describe('with mocked activities get call', () => {
    // Request handler that simply returns empty data for every request
    const request = mockRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const mockToken = 'testToken';
    const client = new GameBusClient(new TokenHandler(mockToken, 'refreshToken', '0'));

    /**
     * UTP: GB - 1
     */
    test('GET activity by ID', async () => {
        // Get single activity from ID
        const activity = await client.activity().getActivityById(0);

        // Check that URL matches and token is used
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/activities/0`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activity).toEqual([]);
    });

    /**
     * UTP: GB - 2
     */
    test('GET activities on date', async () => {
        // Get activities from a date (as Date object)
        const activities = await client.activity().getActivitiesOnDate(0, new Date('2021-04-19'));

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29%2CNutrition_Diary%2CLOG_INSULIN%2CBLOOD_GLUCOSE_MSMT%2CLOG_MOOD%2CBODY_MASS_INDEX&end=20-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 3
     */
    test('GET activities between dates', async () => {
        // Get activities between dates (as Date objects)
        const activities = await client
            .activity()
            .getAllAcitivitiesBetweenDate(0, new Date('2021-04-19'), new Date('2021-04-21'));

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29%2CNutrition_Diary%2CLOG_INSULIN%2CBLOOD_GLUCOSE_MSMT%2CLOG_MOOD%2CBODY_MASS_INDEX&end=21-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 3
     */
    test('GET activities between dates with pagination', async () => {
        const activities = await client
            .activity()
            .getAllAcitivitiesBetweenDate(
                0,
                new Date('2021-04-19'),
                new Date('2021-04-21'),
                QueryOrder.DESC,
                10,
                1
            );

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29%2CNutrition_Diary%2CLOG_INSULIN%2CBLOOD_GLUCOSE_MSMT%2CLOG_MOOD%2CBODY_MASS_INDEX&end=21-04-2021&start=19-04-2021&sort=-date&limit=10&page=1`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 4
     */
    test('GET activities on Unix date', async () => {
        // Get activity from (13-digit) unix timestamp
        const unixTimestamp = new Date('2021-04-19').getTime();
        const activities = await client.activity().getActivitiesOnUnixDate(0, unixTimestamp);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29%2CNutrition_Diary%2CLOG_INSULIN%2CBLOOD_GLUCOSE_MSMT%2CLOG_MOOD%2CBODY_MASS_INDEX&end=20-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 5
     */
    test('GET activities between Unix dates', async () => {
        // Get activities between (13-digit) unix timestamps
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const activities = await client
            .activity()
            .getAllActivitiesBetweenUnix(0, unixTimestampBefore, unixTimestampAfter);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK%2CRUN%2CBIKE%2CSOCCER%2CBASKETBALL%2CVOLLEYBALL%2CRUGBY%2CBASEBALL%2CHORSE_RIDING%2CATHLETICS%2CSWIMMING%2CWATER_POLO%2CSURFING%2CGOLF%2CLACROSSE%2CTENNIS%2CSQUASH%2CBADMINTON%2CTABLE_TENNIS%2CSKIING%2CICE_HOCKEY%2CFIELD_HOCKEY%2CICE_SKATING%2CROLLER_SKATING%2CFITNESS%2CYOGA%2CAEROBICS%2CMARTIAL_ARTS%2CDANCE%2CPOOL%2CDARTS%2CAIR_HOCKEY%2CBOWLING%2CCHESS%2CGYMNASTICS%2CHIKE%2CMOUNTAINBIKE%2CWALK%28DETAIL%29%2CRUN%28DETAIL%29%2CBIKE%28DETAIL%29%2CNutrition_Diary%2CLOG_INSULIN%2CBLOOD_GLUCOSE_MSMT%2CLOG_MOOD%2CBODY_MASS_INDEX&end=21-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 6
     */
    test('GET activities with game descriptor keys', async () => {
        const gds = ['WALK'];
        const activities = await client.activity().getAllActivitiesWithGd(0, gds);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 7
     */
    test('GET activities with game descriptor keys between Unix dates', async () => {
        const unixTimestampBefore = new Date('2021-04-19').getTime();
        const unixTimestampAfter = new Date('2021-04-21').getTime();
        const gds = ['WALK'];
        const activities = await client
            .activity()
            .getAllActivitiesBetweenUnixWithGd(0, unixTimestampBefore, unixTimestampAfter, gds);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK&end=21-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });

    /**
     * UTP: GB - 8
     */
    test('GET activities with game descriptor keys on Unix date', async () => {
        const unixTimestamp = new Date('2021-04-19').getTime();
        const gds = ['WALK'];
        const activities = await client
            .activity()
            .getActivitiesOnUnixDateWithGd(0, unixTimestamp, gds);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: `${endpoint}/players/0/activities?gds=WALK&end=20-04-2021&start=19-04-2021&sort=-date`,
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockToken}`
                })
            })
        );
        expect(activities).toEqual([]);
    });
});
