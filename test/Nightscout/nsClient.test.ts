import { NightScoutClient } from '../../src/nightscout/nsClient';
import { NightScoutEntryModel, NightScoutTreatmentModel } from '../../src/services/dataParsers/nightscoutParser';
import { mockRequest } from '../testUtils/requestUtils';

jest.mock('axios');

describe('GameBusClient requests', () => {
    // Request handler that simply returns empty data for every request
    const request = mockRequest(() => {
        return Promise.resolve({
            data: []
        });
    });

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    const nightscoutUrl = 'https://example-instance.herokuapp.com';
    const token = 'addtokenhere';
    const client = new NightScoutClient(nightscoutUrl, token);


    // test objects
    const testEntry: NightScoutEntryModel = {
        type: 'sgv',
        date: 1622383144021,
        sgv: 79,
        noise: 0,
        filtered: 0,
        unfiltered: 0,
        rssi: 0
    };

    const testTreatment: NightScoutTreatmentModel = {
        eventType: "Correction Bolus",
        created_at: "2021-05-29",
        insulin: 4,
        notes: "BlablaTest",
        enteredBy: "Frans"
    }

    test('Posting an entry', async () => {
        const response = await client.postEntry(testEntry);
        // Full response means data is given separately
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: nightscoutUrl + '/api/v1/entries?token=' + token
            })
        );
    });

    test('Posting a treatment', async () => {
        const response = await client.postTreatment(testTreatment);
        // Full response means data is given separately
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: nightscoutUrl + '/api/v1/treatments?token=' + token
            })
        );
    });


    test('Getting entries', async () => {
        const response = await client.getEntries();
        // Full response means data is given separately
        expect(response).toStrictEqual([]);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: nightscoutUrl + '/api/v1/entries/sgv.json?token=' + token
            })
        );
    });

    test('Getting treatments', async () => {
        const response = await client.getTreatments();
        // Full response means data is given separately
        expect(response).toStrictEqual([]);
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: nightscoutUrl + '/api/v1/treatments?token=' + token
            })
        );
    });


    test('Getting glucose unit', async () => {
        // Full response means data is given separately
        expect(async () => {await client.getGlucoseUnit()}).rejects.toThrow('Could not read glucose unit from the Nightscout website!');
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: nightscoutUrl + '/api/v1/status?token=' + token
            })
        );
    });

});
