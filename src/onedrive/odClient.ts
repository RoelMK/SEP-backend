import axios, { AxiosInstance , AxiosRequestConfig} from 'axios';
const endpoint = 'https://api3.gamebus.eu/v2/';

export class OneDriveClient {
    // Axios client
    private readonly client: AxiosInstance;

    private token: string;
    private fileName: string;
    private folderPath: string | undefined;
    private sheetName: string;

    // Create Axios instance, can add options if needed
    constructor(token: string, fileName: string, folderPath?: string, sheetName?: string) {
        this.client = axios.create();
        this.token = token;
        this.fileName = fileName;
        this.folderPath = folderPath;
        this.sheetName = sheetName ?? "Sheet1"; //Default value
    }

    /**
     * Retrieves the data in the remote excel file as a text array using data from constructor
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns 2D array of text with topLeft as [0][0]
     */
    async getRangeText(topLeft: string, bottomRight: string) {
        let result = await this.getRange(topLeft,bottomRight);
        return result.data.text;
    }

    /**
     * Retrieves the data in the remote excel file as a value array using data from constructor
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns 2D array of values with topLeft as [0][0]
     */
    async getRangeValues(topLeft: string, bottomRight: string) {
        let result = await this.getRange(topLeft,bottomRight);
        return result.data.values;
    }

    /**
     * Retrieves the data in the remote excel file as a JSON response
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done 
     */
    private async getRange(topLeft: string, bottomRight: string) {
        //console.log("Get fileID");
        let fileResult = await this.getFile(this.token,this.fileName,this.folderPath);
        let workbookID = fileResult.id;
    
        //console.log("Get session");
        let sessionResult = await this.getExcelSession(workbookID,this.token);
        let sessionID = sessionResult.data.id;
    
        //console.log("Get range");
        let rangeResult = await this.getRangeDetailed(workbookID,this.token,sessionID,this.sheetName,topLeft,bottomRight);
        return rangeResult;
    }

    /**
     * Retrieves the data in the remote excel file as a text array using parameter
     * @param topLeft Topleft cell of the to be retrieved range
     * @param bottomRight Bottomright cell of the to be retrieved range
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done 
     */
    private async getRangeDetailed(workbookID: string, token: string, sessionID: string, workSheetName: string, topLeft: string, bottomRight: string) {
        let requestHeaders = {
            'content-type': 'Application/Json',
            'authorization': `Bearer ${token}`,
            'workbook-session-id': `Bearer ${sessionID}`
        }
    
        let config : AxiosRequestConfig = {
            method: 'GET',
            url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets('${workSheetName}')/range(address='${workSheetName}!${topLeft}:${bottomRight}')`,
            headers: requestHeaders,
            data: {}
        }
        console.log(config.url)
        let response = await this.client.request(config);
        return response;
    }

    /**
     * Creates a non-persistent Excelsession 
     * @param workbookID ID of the Excel workbook to get a session for
     * @param token Onedrive token for authentication
     * @returns its complicated //TODO actually make an interface for it, even though it doesn't do anything as it isnt used outside of this class and it is AXIOS response, so class checking is not done 
     */
    private async getExcelSession(workbookID : string, token : string) {
        let requestHeaders = {
            'content-type': 'Application/Json',
            'authorization': `Bearer ${token}`
        }
        let body = { 
            "persistChanges": false //we only do reads 
        }
        let response = await this.client.request({
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
    
    private async getFile(token : string, fileName : string, folderPath? : string) {
        let requestHeaders = {
            'content-type': 'Application/Json',
            'authorization': `Bearer ${token}`
        }
        let body = {
        }
        let subUrl = "";
        if(folderPath === undefined) {
            subUrl = "";
        } else {
            subUrl = `:/${folderPath}:`
        }
        //console.log(`https://graph.microsoft.com/v1.0/me/drive/root${subUrl}/children`)
        let response = await this.client.request({
            method: 'GET',
            url : `https://graph.microsoft.com/v1.0/me/drive/root${subUrl}/children`,
            headers: requestHeaders,
            data: body
        });
        let file = response.data.value.find(element => element.name === fileName)
        return file;
    }
}
