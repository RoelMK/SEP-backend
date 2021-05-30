import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient, RequestMethod } from '../../src/gb/gbClient';
import { NightScoutClient } from '../../src/nightscout/nsClient';
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

    const nightscoutUrl = 'https://nightscout-sep.herokuapp.com';
    const client = new NightScoutClient(nightscoutUrl, 'rink-27f591f2e4730a68');


});
