import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
jest.mock('axios');

export function mockGameBusRequest(
    requestHandler: (req: AxiosRequestConfig) => Promise<Partial<AxiosResponse>>
) {
    // Mock the Axios client to get our own response from a request URL
    const request = jest.fn();

    const mockClient = {
        request
    };

    (axios.create as jest.Mock).mockImplementation(() => mockClient);

    // Give response back from the given requestHandler
    request.mockImplementation(requestHandler);

    return request;
}
