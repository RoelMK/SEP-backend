/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { table } from 'console';
import { oneDriveToken } from '../gb/usersExport';
import { OneDriveClient } from './odClient';

const client: AxiosInstance = axios.create();

//https://docs.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0

//NOTE: token/sessionID (I forgot) expires after ~ 7 minutes of inactivity (5 if we use persistent changes)
async function getExcelSession(workbookID: string, token: string) {
    const requestHeaders = {
        'content-type': 'Application/Json',
        authorization: `Bearer ${token}`
    };
    const body = {
        persistChanges: false //we only do reads
    };
    const response = await client.request({
        method: 'POST',
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/createSession`,
        headers: requestHeaders,
        data: body
    });
    return response;
    /*
    Sample response:
    
    HTTP code: 201 Created
    content-type: application/json;odata.metadata 

    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.sessionInfo",
        "id": "{session-id}",
        "persistChanges": true
    }
    */
}

async function getRange(
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
        //url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets/${worksheetID}/range(adress='${topLeft}:${bottomRight}')`,
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets('${workSheetName}')/range(address='${workSheetName}!${topLeft}:${bottomRight}')`,
        headers: requestHeaders,
        data: {}
    };
    console.log(config.url);
    const response = await client.request(config);
    return response;
    /*
    Sample Response
    {
        HTTP code: 200 OK
        content-type: application/json;odata.metadata 

        {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#range",
        "@odata.type": "#microsoft.graph.workbookRange",
        "@odata.id": "/users('f6d92604-4b76-4b70-9a4c-93dfbcc054d5')/drive/items('01CYZLFJDYBLIGAE7G5FE3I4VO2XP7BLU4')/workbook/worksheets(%27%7B00000000-0001-0000-0300-000000000000%7D%27)/range(address=%27A1:B2%27)",
        "address": "test!A1:B2",
        "addressLocal": "test!A1:B2",
        "cellCount": 4,
        "columnCount": 2,
        "columnHidden": false,
        "columnIndex": 0,
        "formulas": [
            [
            "",
            ""
            ],
            [
            "",
            ""
            ]
        ],
        "formulasLocal": [
            [
            "",
            ""
            ],
            [
            "",
            ""
            ]
        ],
        "formulasR1C1": [
            [
            "",
            ""
            ],
            [
            "",
            ""
            ]
        ],
        "hidden": false,
        "numberFormat": [
            [
            "General",
            "General"
            ],
            [
            "General",
            "General"
            ]
        ],
        "rowCount": 2,
        "rowHidden": false,
        "rowIndex": 0,
        "text": [
            [
            "",
            ""
            ],
            [
            "",
            ""
            ]
        ],
        "values": [
            [
            "",
            ""
            ],
            [
            "",
            ""
            ]
        ],
        "valueTypes": [
            [
            "Empty",
            "Empty"
            ],
            [
            "Empty",
            "Empty"
            ]
        ]
        }
    }
    */
}
//Used when we didn't search on sheet name
async function getListOfSheets(workbookID: string, token: string, sessionID: string) {
    const requestHeaders = {
        'content-type': 'Application/Json',
        authorization: `Bearer ${token}`,
        'workbook-session-id': `Bearer ${sessionID}`
    };

    const response = await client.request({
        method: 'GET',
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets`,
        headers: requestHeaders,
        data: {}
    });
    return response;
    /*
    Sample response:
    HTTP code: 200 OK
    content-type: application/json;odata.metadata 

    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('f6d92604-4b76-4b70-9a4c-93dfbcc054d5')/drive/items('01CYZLFJGUJ7JHBSZDFZFL25KSZGQTVAUN')/workbook/worksheets",
        "value": [
            {
                "@odata.id": "/users('f6d92604-4b76-4b70-9a4c-93dfbcc054d5')/drive/items('01CYZLFJGUJ7JHBSZDFZFL25KSZGQTVAUN')/workbook/worksheets(%27%7B00000000-0001-0000-0000-000000000000%7D%27)",
                "id": "{00000000-0001-0000-0000-000000000000}",
                "name": "Sheet1",
                "position": 0,
                "visibility": "Visible"
            },
            {
                "@odata.id": "/users('f6d92604-4b76-4b70-9a4c-93dfbcc054d5')/drive/items('01CYZLFJGUJ7JHBSZDFZFL25KSZGQTVAUN')/workbook/worksheets(%27%7B00000000-0001-0000-0100-000000000000%7D%27)",
                "id": "{00000000-0001-0000-0100-000000000000}",
                "name": "Sheet57664",
                "position": 1,
                "visibility": "Visible"
            }
        ]
    }
    */
}

async function getFile(token: string, fileName: string, folderPath?: string) {
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
    const response = await client.request({
        method: 'GET',
        //url: `https://graph.microsoft.com/v1.0/me/drive/root/children`,
        //url: `https://graph.microsoft.com/v1.0/me/drive/root:/Documents:/children`,
        url: `https://graph.microsoft.com/v1.0/me/drive/root${subUrl}/children`,
        headers: requestHeaders,
        data: body
    });
    /*
    console.log(response.status);
    console.log(response.statusText);
    //console.log(response.headers);
    console.log(response.data);

    console.log(`ID = ${response.data.value[0].id}`) //TODO: gets first item instead of with correct name
    */
    //let x = $.grep(response.data.value, function(v:any) { return v.name === fileName; })[0]
    const file = response.data.value.find((element) => element.name === fileName);
    return file;
}

//async function because top-level await gives problems
async function execute() {
    const sheetName = 'Sheet2';
    //let workbookID = "7B38536F62C21674!106";//TODO: obtain this in a viable way instead of stealing it.
    //let fileName = "MyFirstSheet.xlsx";
    //let folderPath = undefined;
    const fileName = 'DeepExcel.xlsx';
    const folderPath = 'Documents/DeepFolder';
    const excelToken = oneDriveToken;
    const topLeft = 'A1';
    const bottomRight = 'H4';

    console.log('Get fileID');
    const fileResult = await getFile(excelToken, fileName, folderPath);
    const workbookID = fileResult.id;

    console.log('Get session');
    const sessionResult = await getExcelSession(workbookID, excelToken);
    const sessionID = sessionResult.data.id;

    /*
    console.log("Get sheets");
    let sheetResult = await getListOfSheets(workbookID,excelToken,sessionID);
    let sheetID = sheetResult.data.value[sheetNumber].id;
    */

    console.log('Get range');
    const rangeResult = await getRange(
        workbookID,
        excelToken,
        sessionID,
        sheetName,
        topLeft,
        bottomRight
    );
    const resultText = rangeResult.data.text;
    const resultValue = rangeResult.data.values;

    console.log('Got the range');

    console.log('ResultText:');
    console.log(resultText);
    console.log('ResultValue');
    console.log(resultValue);
}

async function execute2() {
    const sheetName = 'Sheet1';
    //let workbookID = "7B38536F62C21674!106";//TODO: obtain this in a viable way instead of stealing it.
    //let fileName = "MyFirstSheet.xlsx";
    //let folderPath = undefined;
    const fileName = 'diary.xlsx';
    const folderPath = 'Documents/DeepFolder';
    const excelToken = oneDriveToken; //token is obtained from http://localhost:8080/onedrive/login
    const topLeft = 'A1';
    const bottomRight = 'H8';

    const odClient: OneDriveClient = new OneDriveClient(
        excelToken,
        fileName,
        folderPath,
        sheetName
    );
    const result = await odClient.getRangeText(topLeft, bottomRight);
    console.log('Done');
    console.log(result);
}

async function execute3() {
    const sheetName = 'Sheet1';
    //let workbookID = "7B38536F62C21674!106";//TODO: obtain this in a viable way instead of stealing it.
    //let fileName = "MyFirstSheet.xlsx";
    //let folderPath = undefined;
    const fileName = 'diary.xlsx';
    const folderPath = 'Documents/DeepFolder';
    const excelToken = oneDriveToken; //token is obtained from http://localhost:8080/onedrive/login
    const tableName = 'fooddiary';

    const odClient: OneDriveClient = new OneDriveClient(
        excelToken,
        fileName,
        folderPath,
        tableName,
        sheetName
    );
    const result = await odClient.getTableValues();
    console.log('Done');
    console.log(result);
}

async function execute4() {
    const sheetName = 'Sheet1';
    //let workbookID = "7B38536F62C21674!106";//TODO: obtain this in a viable way instead of stealing it.
    //let fileName = "Book1.xlsx";
    //let folderPath = undefined;
    const fileName = 'diary.xlsx';
    const folderPath = 'Documents/DeepFolder';
    const excelToken = oneDriveToken; //token is obtained from http://localhost:8080/onedrive/login
    const tableName = 'fooddiary';

    const odClient: OneDriveClient = new OneDriveClient(
        excelToken,
        fileName,
        folderPath,
        tableName,
        sheetName
    );
    // @ts-ignore
    const result = await odClient.getRangeValues("A2","J9");
    console.log()
    console.log()
    console.log(result)
    console.log('Done');
}

execute4();
//http://localhost:8080/onedrive/login
