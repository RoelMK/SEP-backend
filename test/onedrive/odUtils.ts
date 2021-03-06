import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

jest.mock('axios');

export function mockOnedriveRequest(
    requestHandler: (req: AxiosRequestConfig) => Promise<Partial<AxiosResponse>>
): jest.Mock<any, any> {
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
