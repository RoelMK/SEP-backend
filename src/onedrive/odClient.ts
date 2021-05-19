import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class OneDriveClient {
    // Axios client
    private readonly client: AxiosInstance;

    private token: string;
    private fileName: string;
    private folderPath: string | undefined; //Undefined means it is in the root
    private sheetName: string;

    // Create Axios instance, can add options if needed
    constructor(token: string, fileName: string, folderPath?: string, sheetName?: string) {
        this.client = axios.create();
        this.token = token;
        this.fileName = fileName;
        this.folderPath = folderPath;
        this.sheetName = sheetName ?? 'Sheet1'; //Default value
    }

    async getTableValues(tableName: string) {
        const result = await this.getTableResult(tableName);
        const returnArray: any[][] = [];
        for (const entry of result?.data.value) {
            returnArray.push(entry.values[0]);
        }
        return returnArray;
    }

    private async getTableDetailed(
        workbookID: string,
        token: string,
        sessionID: string,
        workSheetName: string,
        tableName: string
    ) {
        const requestHeaders = {
            'content-type': 'Application/Json',
            authorization: `Bearer ${token}`,
            'workbook-session-id': `Bearer ${sessionID}`
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/tables('${tableName}')/rows`,
                headers: requestHeaders,
                data: {}
            };
            const response = await this.client.request(config);
            return response;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    private async getTableResult(tableName: string) {
        console.log('Get fileID');
        const fileResult = await this.getFile(this.token, this.fileName, this.folderPath);
        const workbookID = fileResult.id;

        console.log('Get session');
        const sessionResult = await this.getExcelSession(workbookID, this.token);
        const sessionID = sessionResult.data.id;

        console.log('Get range');
        const rangeResult = await this.getTableDetailed(
            workbookID,
            this.token,
            sessionID,
            this.sheetName,
            tableName
        );
        return rangeResult;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getTableList(tableName: string) {
        console.log('Get fileID');
        const fileResult = await this.getFile(this.token, this.fileName, this.folderPath);
        const workbookID = fileResult.id;

        console.log('Get session');
        const sessionResult = await this.getExcelSession(workbookID, this.token);
        const sessionID = sessionResult.data.id;

        console.log('Get Table list');
        const rangeResult = await this.getTableListDetailed(
            workbookID,
            this.token,
            sessionID,
            this.sheetName
        );
        return rangeResult;
    }

    private async getTableListDetailed(
        workbookID: string,
        token: string,
        sessionID: string,
        workSheetName: string
    ) {
        const requestHeaders = {
            accept: 'Application/Json',
            authorization: `Bearer ${token}`,
            'workbook-session-id': `Bearer ${sessionID}`
        };
        try {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets('${workSheetName}')/tables`,
                headers: requestHeaders,
                data: {}
            };
            const response = await this.client.request(config);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Retrieves the data in the remote excel file as a text array using data from constructor
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns 2D array of text with topLeft as [0][0]
     */
    async getRangeText(topLeft: string, bottomRight: string) {
        const result = await this.getRangeResult(topLeft, bottomRight);
        return result.data.text;
    }

    async getColumnsText(left: string, right: string) {
        const result = await this.getRangeResult(left, right);
        return result.data.text;
    }

    /**
     * Retrieves the data in the remote excel file as a value array using data from constructor
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns 2D array of values with topLeft as [0][0]
     */
    async getRangeValues(topLeft: string, bottomRight: string) {
        const result = await this.getRangeResult(topLeft, bottomRight);
        return result.data.values;
    }

    /**
     * Retrieves the data in the remote excel file as a JSON response
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done
     */
    private async getRangeResult(topLeft: string, bottomRight: string) {
        //console.log("Get fileID");
        const fileResult = await this.getFile(this.token, this.fileName, this.folderPath);
        const workbookID = fileResult.id;

        //console.log("Get session");
        const sessionResult = await this.getExcelSession(workbookID, this.token);
        const sessionID = sessionResult.data.id;

        //console.log("Get range");
        const rangeResult = await this.getRangeDetailed(
            workbookID,
            this.token,
            sessionID,
            this.sheetName,
            topLeft,
            bottomRight
        );
        return rangeResult;
    }

    /**
     * Retrieves the data in the remote excel file as a text array using parameter
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done
     */
    private async getRangeDetailed(
        workbookID: string,
        token: string,
        sessionID: string,
        workSheetName: string,
        topLeft: string,
        bottomRight: string
    ) {
        const requestHeaders = {
            'content-type': 'Application/Json',
            authorization: `Bearer ${token}`,
            'workbook-session-id': `Bearer ${sessionID}`
        };

        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets('${workSheetName}')/range(address='${workSheetName}!${topLeft}:${bottomRight}')`,
            headers: requestHeaders,
            data: {}
        };
        const response = await this.client.request(config);
        return response;
    }

    /**
     * Creates a non-persistent Excelsession
     * @param workbookID ID of the Excel workbook to get a session for
     * @param token Onedrive token for authentication
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done
     */
    private async getExcelSession(workbookID: string, token: string) {
        const requestHeaders = {
            'content-type': 'Application/Json',
            authorization: `Bearer ${token}`
        };
        const body = {
            persistChanges: false //we only do reads
        };
        const response = await this.client.request({
            method: 'POST',
            url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/createSession`,
            headers: requestHeaders,
            data: body
        });
        return response;
    }

    /**
     * Searches through the given folder (or root if undefined) for the given file and returns info about the file
     * @param token Onedrive token for authentication
     * @param fileName Name of the file to get the data from
     * @param folderPath The path to the file (exculding the filename), if root set to undefined
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done
     */

    private async getFile(token: string, fileName: string, folderPath?: string) {
        const requestHeaders = {
            'content-type': 'Application/Json',
            authorization: `Bearer ${token}`
        };
        const body = {};
        let subUrl = '';
        if (folderPath === undefined) {
            subUrl = '';
        } else {
            subUrl = `:/${folderPath}:`;
        }
        //console.log(`https://graph.microsoft.com/v1.0/me/drive/root${subUrl}/children`)
        const response = await this.client.request({
            method: 'GET',
            url: `https://graph.microsoft.com/v1.0/me/drive/root${subUrl}/children`,
            headers: requestHeaders,
            data: body
        });
        const file = response.data.value.find((element) => element.name === fileName);
        return file;
    }
}
