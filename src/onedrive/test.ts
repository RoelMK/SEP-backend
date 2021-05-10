import axios, { AxiosInstance } from 'axios';
let client : AxiosInstance = axios.create();

//https://docs.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0

//NOTE: token expires after ~ 7 minutes of inactivity (5 if we use persistent changes)
async function getExcelSession(workbookID : string, token : string) {
    let requestHeaders = {
        'content-type': 'Application/Json',
        'authorization': `Bearer ${token}`
    }
    let body = { 
        "persistChanges": false //we only do reads 
    }
    let response = await client.request({
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

async function getRange(workbookID : string, token : string, sessionID : string, worksheetID : string, topLeft : string, bottomRight: string) {
    let requestHeaders = {
        'content-type': 'Application/Json',
        'authorization': `Bearer ${token}`,
        'workbook-session-id': `Bearer ${sessionID}`
    }
    
    let response = await client.request({
        method: 'POST',
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/worksheets/${worksheetID}/range(adress='${topLeft}:${bottomRight}')`,
        headers: requestHeaders,
        data: {}
    });
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
async function getListOfSheets(workbookID : string, token : string, sessionID : string) {
    let requestHeaders = {
        'content-type': 'Application/Json',
        'authorization': `Bearer ${token}`,
        'workbook-session-id': `Bearer ${sessionID}`
    }
    
    let response = await client.request({
        method: 'POST',
        url: `https://graph.microsoft.com/v1.0/me/drive/items/${workbookID}/workbook/createSession`,
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

//async function because top-level await gives problems
async function execute() {
    let sheetNumber = 0;
    let workbookID = "TODO: id";
    let excelToken = "TODO: token";
    let topLeft = "A1";
    let bottomRight = "C3";

    let sessionResult = await getExcelSession(workbookID,excelToken);
    let sessionID = sessionResult.data.id;

    let sheetResult = await getListOfSheets(workbookID,excelToken,sessionID);
    let sheetID = sheetResult.data.value[sheetNumber].id;

    let rangeResult = await getRange(workbookID,excelToken,sessionID,workbookID,topLeft,bottomRight);
    let resultText = rangeResult.data.text;
    let resultValue = rangeResult.data.values;

    console.log(resultText)
    console.log()
    console.log(resultValue)
}

execute()