import { TokenHandler } from '../../src/gb/auth/tokenHandler';
import { GameBusClient } from '../../src/gb/gbClient';
import { OneDriveClient } from '../../src/onedrive/odClient';
import { mockOnedriveRequest } from './odUtils';

jest.mock('axios');

// TODO: improve coverage

describe('with mocked activities get call', () => {
    // Request handler that returns simulated onedrive responses
    const request = mockOnedriveRequest((obj) => {
        //getFile for Documents/Deepfolder
        if(obj.url === "https://graph.microsoft.com/v1.0/me/drive/root:/Documents/DeepFolder:/children") {
            return Promise.resolve({
                //for getFile
                data: {
                    '@odata.context': "https://graph.microsoft.com/v1.0/$metadata#users('diabettertest2%40outlook.com')/drive/root/children",
                    '@odata.count': 2,
                    value: [
                      {
                        '@microsoft.graph.downloadUrl': 'https://sjfvua.am.files.1drv.com/y4mKyBqbvr37IuDUZkOWoUfVh4vBphlssElu96csALoano1s8DdjmVzVgSF16YScq0WimWJN1jnD1bTO4ZWDjzlR4jvDBKmKDcRst4LSgwpwfMGKJ9eYdOQ8ZIdZrL1rebB73kjh7fxrOugZj7ywFxrmA4rQAetadMabVmPHkR5GPji5NuIsVj1NJ4QFMot7vdD',
                        createdDateTime: '2021-05-15T11:01:13.657Z',
                        cTag: 'aYzo0MDI1ODMzRDk3NEY5RkU4ITEwNy41MzA',
                        eTag: 'aNDAyNTgzM0Q5NzRGOUZFOCExMDcuMTY',
                        id: '4025833D974F9FE8!107',
                        lastModifiedDateTime: '2021-05-15T11:03:17.51Z',
                        name: 'DeepExcel.xlsx',
                        size: 8949,
                        webUrl: 'https://1drv.ms/x/s!AOifT5c9gyVAaw',
                        reactions: { commentCount: 0 },
                        createdBy: { user: { displayName: 'dia better', id: '4025833d974f9fe8' } },
                        lastModifiedBy: { user: { displayName: 'dia better', id: '4025833d974f9fe8' } },
                        parentReference: {
                          driveId: '4025833d974f9fe8',
                          driveType: 'personal',
                          id: '4025833D974F9FE8!106',
                          name: 'DeepFolder',
                          path: '/drive/root:/Documents/DeepFolder'
                        },
                        file: {
                          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          hashes: {
                            quickXorHash: '',
                            sha1Hash: 'F2EC6F7FA714D5996FDD74148D465000AFAA6B01',
                            sha256Hash: 'EEEA6703600BBA7F59D66B24994D37F81E6DDEA56BB4C0EC2CF9B127306C3440'
                          }
                        },
                        fileSystemInfo: {
                          createdDateTime: '2021-05-15T11:01:13.656Z',
                          lastModifiedDateTime: '2021-05-15T11:02:10.35Z'
                        }
                      },
                      {
                        '@microsoft.graph.downloadUrl': 'https://sjfvua.am.files.1drv.com/y4mO4S8_eXeuRhS33VUGNg4peIknOTjmGFUKlv12GZnrYhxRkjKLHaDggW0OMGpoY20WDXLHkP291okd-AH6s1eRfQYC3oD0FW5O-3XLH8e_vBLjYe3zjal7TOzeAd9IAGi6GvA7xATrszkYf6wVjfMS6nN2x-WFn78VvODHXG70LBIXYUMxZfMDhY2_pnvOl9T',
                        createdDateTime: '2021-05-17T09:42:51.287Z',
                        cTag: 'aYzo0MDI1ODMzRDk3NEY5RkU4ITExMi40MzMy',
                        eTag: 'aNDAyNTgzM0Q5NzRGOUZFOCExMTIuMTgw',
                        id: '4025833D974F9FE8!112',
                        lastModifiedDateTime: '2021-05-22T09:57:27.18Z',
                        name: 'diary.xlsx',
                        size: 13879,
                        webUrl: 'https://1drv.ms/x/s!AOifT5c9gyVAcA',
                        reactions: { commentCount: 0 },
                        createdBy: {
                          application: { displayName: 'OneDrive', id: '481710a4' },
                          user: { displayName: 'dia better', id: '4025833d974f9fe8' }
                        },
                        lastModifiedBy: { user: { displayName: 'dia better', id: '4025833d974f9fe8' } },
                        parentReference: {
                          driveId: '4025833d974f9fe8',
                          driveType: 'personal',
                          id: '4025833D974F9FE8!106',
                          name: 'DeepFolder',
                          path: '/drive/root:/Documents/DeepFolder'
                        },
                        file: {
                          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          hashes: {
                            quickXorHash: '',
                            sha1Hash: '8FBAA1D6102F491DE2E75EB5547ECF54FE9CE4A2',
                            sha256Hash: '73D9E028528A9C6C22F2AE29273C2EE99EE802E36B882F60CCE9B72DDDA7E357'
                          }
                        },
                        fileSystemInfo: {
                          createdDateTime: '2021-05-17T09:42:51.286Z',
                          lastModifiedDateTime: '2021-05-22T09:12:35.826Z'
                        }
                      }
                    ]
                  }
            });  
        }
        //start session
        if(obj.url === "https://graph.microsoft.com/v1.0/me/drive/items/4025833D974F9FE8!112/workbook/createSession") {
            return Promise.resolve({
                //for getFile
                data: {
                    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.workbookSessionInfo',
                    persistChanges: false,
                    id: 'cluster=PNL1&session=15.AM4PEPF00008EAB1.A81.1.V25.12167DCFK4uhdk6FbDSoFQLiJ14.5.en-US5.en-US24.4025833d974f9fe8-Private1.S1.N16.16.0.14117.3590314.5.en-US5.en-US1.V1.N0.1.S&usid=817473cc-1ab9-410c-a3c5-53e02610ca93'
                  }
            });  
        }
        //getTable
        if(obj.url === "https://graph.microsoft.com/v1.0/me/drive/items/4025833D974F9FE8!112/workbook/tables('fooddiary')/rows") {
            return Promise.resolve({
                //for getFile
                data: {
                    '@odata.context': "https://graph.microsoft.com/v1.0/$metadata#users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables('fooddiary')/rows",
                    value: [
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=0)",
                        index: 0,
                        values: [ [ 44444, 0.5, '', 'Pasta', 10, 4, 5, 2, '', 7 ] ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=1)",
                        index: 1,
                        values: [
                          [
                            44413,   0.55, '',
                            'Pizza', 3,    2,
                            4,       '',   '',
                            4
                          ]
                        ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=2)",
                        index: 2,
                        values: [ [ '', 0, 'Snack', '', 5, 3, 2, 1, '', '' ] ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=3)",
                        index: 3,
                        values: [
                          [
                            44200,
                            '',
                            'Breakfast',
                            'Cheese sandwich',
                            3,
                            1,
                            4,
                            '',
                            '',
                            4
                          ]
                        ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=4)",
                        index: 4,
                        values: [
                          [
                            '', '', '', '', '',
                            '', '', '', '', ''
                          ]
                        ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=5)",
                        index: 5,
                        values: [
                          [ '', 0.5, 'Lunch', 'Cheese sandwich', 12, '', 2, '', '', '' ]
                        ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=6)",
                        index: 6,
                        values: [
                          [ '', '', '', 'Cheese and ham sandwich', 24, '', 4, '', '', 4 ]
                        ]
                      },
                      {
                        '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/tables(%27%7B4732EEDC-239B-483E-BDDA-BC9853616E86%7D%27)/rows/itemAt(index=7)",
                        index: 7,
                        values: [ [ '', '', '', 'Crisps', 12, '', 4, '', 5, '' ] ]
                      }
                    ]
                  }
            });  
        }
        //getRange
        if(obj.url === "https://graph.microsoft.com/v1.0/me/drive/items/4025833D974F9FE8!112/workbook/worksheets('Sheet1')/range(address='Sheet1!A2:J9')") {
            return Promise.resolve({
                data: {
                    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#workbookRange',
                    '@odata.type': '#microsoft.graph.workbookRange',
                    '@odata.id': "/users('diabettertest2%40outlook.com')/drive/items('4025833D974F9FE8%21112')/workbook/worksheets(%27%7B00000000-0001-0000-0000-000000000000%7D%27)/range(address=%27Sheet1!A2:J9%27)",
                    address: 'Sheet1!A2:J9',
                    addressLocal: 'Sheet1!A2:J9',
                    columnCount: 10,
                    cellCount: 80,
                    columnHidden: false,
                    rowHidden: false,
                    numberFormat: [
                      [
                        'm/d/yyyy', 'h:mm',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General'
                      ],
                      [
                        'm/d/yyyy', 'h:mm',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General'
                      ],
                      [
                        'General', 'h:mm',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General'
                      ],
                      [
                        'm/d/yyyy', 'General',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General',
                        'General',  'General'
                      ],
                      [
                        'General', 'h:mm',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General'
                      ],
                      [
                        'General', 'h:mm',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General'
                      ],
                      [
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General'
                      ],
                      [
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General',
                        'General', 'General'
                      ]
                    ],
                    columnIndex: 0,
                    text: [
                      [
                        '9/5/2021', '12:00',
                        '',         'Pasta',
                        '10',       '4',
                        '5',        '2',
                        '',         '7'
                      ],
                      [
                        '8/5/2021', '13:12',
                        '',         'Pizza',
                        '3',        '2',
                        '4',        '',
                        '',         '4'
                      ],
                      [
                        '',      '0:00',
                        'Snack', '',
                        '5',     '3',
                        '2',     '1',
                        '',      ''
                      ],
                      [
                        '1/4/2021',
                        '',
                        'Breakfast',
                        'Cheese sandwich',
                        '3',
                        '1',
                        '4',
                        '',
                        '',
                        '4'
                      ],
                      [
                        '', '', '', '', '',
                        '', '', '', '', ''
                      ],
                      [
                        '',
                        '12:00',
                        'Lunch',
                        'Cheese sandwich',
                        '12',
                        '',
                        '2',
                        '',
                        '',
                        ''
                      ],
                      [
                        '',
                        '',
                        '',
                        'Cheese and ham sandwich',
                        '24',
                        '',
                        '4',
                        '',
                        '',
                        '4'
                      ],
                      [ '', '', '', 'Crisps', '12', '', '4', '', '5', '' ]
                    ],
                    formulas: [
                      [ 44444, 0.5, '', 'Pasta', 10, 4, 5, 2, '', 7 ],
                      [
                        44413,   0.55, '',
                        'Pizza', 3,    2,
                        4,       '',   '',
                        4
                      ],
                      [ '', 0, 'Snack', '', 5, 3, 2, 1, '', '' ],
                      [ 44200, '', 'Breakfast', 'Cheese sandwich', 3, 1, 4, '', '', 4 ],
                      [
                        '', '', '', '', '',
                        '', '', '', '', ''
                      ],
                      [ '', 0.5, 'Lunch', 'Cheese sandwich', 12, '', 2, '', '', '' ],
                      [ '', '', '', 'Cheese and ham sandwich', 24, '', 4, '', '', 4 ],
                      [ '', '', '', 'Crisps', 12, '', 4, '', 5, '' ]
                    ],
                    formulasLocal: [
                      [ 44444, 0.5, '', 'Pasta', 10, 4, 5, 2, '', 7 ],
                      [
                        44413,   0.55, '',
                        'Pizza', 3,    2,
                        4,       '',   '',
                        4
                      ],
                      [ '', 0, 'Snack', '', 5, 3, 2, 1, '', '' ],
                      [ 44200, '', 'Breakfast', 'Cheese sandwich', 3, 1, 4, '', '', 4 ],
                      [
                        '', '', '', '', '',
                        '', '', '', '', ''
                      ],
                      [ '', 0.5, 'Lunch', 'Cheese sandwich', 12, '', 2, '', '', '' ],
                      [ '', '', '', 'Cheese and ham sandwich', 24, '', 4, '', '', 4 ],
                      [ '', '', '', 'Crisps', 12, '', 4, '', 5, '' ]
                    ],
                    formulasR1C1: [
                      [ 44444, 0.5, '', 'Pasta', 10, 4, 5, 2, '', 7 ],
                      [
                        44413,   0.55, '',
                        'Pizza', 3,    2,
                        4,       '',   '',
                        4
                      ],
                      [ '', 0, 'Snack', '', 5, 3, 2, 1, '', '' ],
                      [ 44200, '', 'Breakfast', 'Cheese sandwich', 3, 1, 4, '', '', 4 ],
                      [
                        '', '', '', '', '',
                        '', '', '', '', ''
                      ],
                      [ '', 0.5, 'Lunch', 'Cheese sandwich', 12, '', 2, '', '', '' ],
                      [ '', '', '', 'Cheese and ham sandwich', 24, '', 4, '', '', 4 ],
                      [ '', '', '', 'Crisps', 12, '', 4, '', 5, '' ]
                    ],
                    hidden: false,
                    rowCount: 8,
                    rowIndex: 1,
                    valueTypes: [
                      [
                        'Double', 'Double',
                        'Empty',  'String',
                        'Double', 'Double',
                        'Double', 'Double',
                        'Empty',  'Double'
                      ],
                      [
                        'Double', 'Double',
                        'Empty',  'String',
                        'Double', 'Double',
                        'Double', 'Empty',
                        'Empty',  'Double'
                      ],
                      [
                        'Empty',  'Double',
                        'String', 'Empty',
                        'Double', 'Double',
                        'Double', 'Double',
                        'Empty',  'Empty'
                      ],
                      [
                        'Double', 'Empty',
                        'String', 'String',
                        'Double', 'Double',
                        'Double', 'Empty',
                        'Empty',  'Double'
                      ],
                      [
                        'Empty', 'Empty',
                        'Empty', 'Empty',
                        'Empty', 'Empty',
                        'Empty', 'Empty',
                        'Empty', 'Empty'
                      ],
                      [
                        'Empty',  'Double',
                        'String', 'String',
                        'Double', 'Empty',
                        'Double', 'Empty',
                        'Empty',  'Empty'
                      ],
                      [
                        'Empty',  'Empty',
                        'Empty',  'String',
                        'Double', 'Empty',
                        'Double', 'Empty',
                        'Empty',  'Double'
                      ],
                      [
                        'Empty',  'Empty',
                        'Empty',  'String',
                        'Double', 'Empty',
                        'Double', 'Empty',
                        'Double', 'Empty'
                      ]
                    ],
                    values: [
                      [ 44444, 0.5, '', 'Pasta', 10, 4, 5, 2, '', 7 ],
                      [
                        44413,   0.55, '',
                        'Pizza', 3,    2,
                        4,       '',   '',
                        4
                      ],
                      [ '', 0, 'Snack', '', 5, 3, 2, 1, '', '' ],
                      [ 44200, '', 'Breakfast', 'Cheese sandwich', 3, 1, 4, '', '', 4 ],
                      [
                        '', '', '', '', '',
                        '', '', '', '', ''
                      ],
                      [ '', 0.5, 'Lunch', 'Cheese sandwich', 12, '', 2, '', '', '' ],
                      [ '', '', '', 'Cheese and ham sandwich', 24, '', 4, '', '', 4 ],
                      [ '', '', '', 'Crisps', 12, '', 4, '', 5, '' ]
                    ]
                  }
            })
        }
        //other failures
        return Promise.resolve({
            data : null
        })
        
    });


    const response = {
        '@microsoft.graph.downloadUrl': 'https://sjemfg.am.files.1drv.com/y4mmMXNEJ6bdkPR5S4cOKBWiNZlHUCFTVxQl9k42CK-ZERdUAhcpos0aT22CELLbzeta25HJ12ed1ljpF_YpRjYAzcT3Cvw3TJ93dIo2b4NIhe1xcJX4AUikR4HTYl2tXO08ejp51P5NYD_e8yFx5RcG-nrqOZztbtKse2VAiRFH-JxoekR_9fQ2qXgxx2qJGld',
        createdDateTime: '2021-05-22T12:57:44.157Z',
        cTag: 'aYzo0MDI1ODMzRDk3NEY5RkU4ITExNS4yOTQ',
        eTag: 'aNDAyNTgzM0Q5NzRGOUZFOCExMTUuNw',
        id: '4025833D974F9FE8!115',
        lastModifiedDateTime: '2021-05-22T13:00:04.867Z',
        name: 'Book1.xlsx',
        size: 7993,
        webUrl: 'https://1drv.ms/x/s!AOifT5c9gyVAcw',
        reactions: { commentCount: 0 },
        createdBy: { user: { displayName: 'dia better', id: '4025833d974f9fe8' } },
        lastModifiedBy: { user: { displayName: 'dia better', id: '4025833d974f9fe8' } },
        parentReference: {
          driveId: '4025833d974f9fe8',
          driveType: 'personal',
          id: '4025833D974F9FE8!101',
          path: '/drive/root:'
        },
        file: {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          hashes: {
            quickXorHash: '',
            sha1Hash: '06953742B2575C26F85F637135AE612EFC9A56A3',
            sha256Hash: '53C995453903A68C86342D84F8F8BEF7FD4AE2406D14DEEE84E976B37322A6D8'
          }
        },
        fileSystemInfo: {
          createdDateTime: '2021-05-22T12:57:44.156Z',
          lastModifiedDateTime: '2021-05-22T12:57:48.31Z'
        }
      }

    // Before each request, clear the count so we start at 0 again
    beforeEach(() => request.mockClear());

    // GameBusClient using mockToken
    const client = new OneDriveClient("token","diary.xlsx","Documents/DeepFolder","Sheet1");

    test('Get tableValues', async () => {
        // Get activities from a date (as Date object)
        const results = await client.getTableValues("fooddiary");
        const expectation = [
            [ 44444,  0.5,          '',                   'Pasta', 10,  4,  5,  2, '',  7 ],
            [ 44413, 0.55,          '',                   'Pizza',  3,  2,  4, '', '',  4 ],
            [    '',    0,     'Snack',                        '',  5,  3,  2,  1, '', '' ],
            [ 44200,   '', 'Breakfast',         'Cheese sandwich',  3,  1,  4, '', '',  4 ],
            [    '',   '',          '',                        '', '', '', '', '', '', '' ],
            [    '',  0.5,     'Lunch',         'Cheese sandwich', 12, '',  2, '', '', '' ],
            [    '',   '',          '', 'Cheese and ham sandwich', 24, '',  4, '', '',  4 ],
            [    '',   '',          '',                  'Crisps', 12, '',  4, '',  5, '' ]
        ]

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(3);
        //TODO: find a way to add these as they don't hold everytime
        /* 
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: "https://graph.microsoft.com/v1.0/me/drive/root/children",
                headers: expect.objectContaining({
                    authorization: 'Bearer token'
                })
            })
        );
        */
        //expect(activities).toEqual([["A1","A2","A3"],["B1","B2","B3"]]);
        expect(results).toEqual(expectation);
    });

    test('Get tableValues', async () => {
        // Get activities from a date (as Date object)
        const results = await client.getRangeValues("A2","J9");
        const expectation = [
            [ 44444,  0.5,          '',                   'Pasta', 10,  4,  5,  2, '',  7 ],
            [ 44413, 0.55,          '',                   'Pizza',  3,  2,  4, '', '',  4 ],
            [    '',    0,     'Snack',                        '',  5,  3,  2,  1, '', '' ],
            [ 44200,   '', 'Breakfast',         'Cheese sandwich',  3,  1,  4, '', '',  4 ],
            [    '',   '',          '',                        '', '', '', '', '', '', '' ],
            [    '',  0.5,     'Lunch',         'Cheese sandwich', 12, '',  2, '', '', '' ],
            [    '',   '',          '', 'Cheese and ham sandwich', 24, '',  4, '', '',  4 ],
            [    '',   '',          '',                  'Crisps', 12, '',  4, '',  5, '' ]
        ]

        // Check that URL matches expected URL and mockToken is used in authorization
        expect(request).toHaveBeenCalledTimes(3);
        //TODO: find a way to add these as they don't hold everytime
        /* 
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({
                url: "https://graph.microsoft.com/v1.0/me/drive/root/children",
                headers: expect.objectContaining({
                    authorization: 'Bearer token'
                })
            })
        );
        */
        //expect(activities).toEqual([["A1","A2","A3"],["B1","B2","B3"]]);
        expect(results).toEqual(expectation);
    });
});
