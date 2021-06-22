import multer from 'multer';
import Router from 'express';
import AbbottParser from '../services/dataParsers/abbottParser';
import {
    CombinedDataParserOutput,
    DataParser,
    OutputDataType
} from '../services/dataParsers/dataParser';
import fs from 'fs';
import { getFileDirectory } from '../services/utils/files';
import FoodDiaryParser from '../services/dataParsers/foodDiaryParser';
import { EetMeterParser } from '../services/dataParsers/eetmeterParser';
import { checkJwt } from '../middlewares/checkJwt';
import { GameBusToken } from '../gb/auth/tokenHandler';
import axios from 'axios';
import { DataEndpoint, EndpointData } from '../services/dataEndpoint';

const upload = multer({ dest: 'uploads/' });
const uploadRouter = Router();

/**
 * Endpoint for uploading files for parsing
 * Parameters:
 * format: one of eetmeter, abbott or fooddiary
 */
uploadRouter.post('/upload', checkJwt, upload.single('file'), function (req: any, res) {
    if (!req.body.format) {
        res.status(400).send('Specify file format!');
        return;
    }
    // retrieve user information
    const userInfo: GameBusToken = {
        playerId: req.user.playerId,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
    };

    // filename is not transferred automatically with the file, meaning the file is named as '0133dsdf'-like
    // use original filename to create a more readable file path
    const filePath: string = getFileDirectory(req.file.path, false) + '\\' + req.file.originalname;
    let promise: Promise<void>;
    switch (req.body.format) {
        case 'eetmeter':
            promise = uploadFile(req, res, new EetMeterParser(filePath, userInfo));
            break;
        case 'abbott':
            promise = uploadFile(req, res, new AbbottParser(filePath, userInfo));
            break;
        case 'fooddiary':
            promise = uploadFile(req, res, new FoodDiaryParser(filePath, userInfo));
            break;
        default:
            res.status(400).send('This data format is not supported');
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.log(e.message);
            }
            return;
    }
    // When an upload is done, remove the file from the server
    promise.then(() => {
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.log(e.message);
        }
    });
});

/**
 *
 * @param req Post request, containing file path of uploaded file and more
 * @param res Query response object, for determining response to frontend
 * @param dataParser DataParser object for parsing incoming files
 * @returns void if process needs to be terminated early due to errors
 */
async function uploadFile(req: any, res: any, dataParser: DataParser): Promise<void> {
    dataParser.parseOnlyNewest(true);
    //rename auto-generated file path to original name
    try {
        fs.renameSync(req.file.path, dataParser.getFilePath());
    } catch (e) {
        console.log(e.message);
        try {
            fs.unlinkSync(req.file.path);
        } catch (e) {
            console.log(e.message);
        }
        res.status(500).send('Could not rename file!');
        return;
    }

    // parse the uploaded file and update response on failure
    try {
        await dataParser.process();
    } catch (e) {
        if (axios.isAxiosError(e)) {
            if (e.response?.status === 401) {
                // Unauthorized
                res.status(401).send();
                return;
            }
        }
        switch (e.name) {
            case 'InputError':
                res.status(400).send(
                    `An erroneous file was uploaded for the selected format, check if you have selected the correct file! Reason: ${e.message}`
                );
                break;
            default:
                console.log(e.message);
                res.status(503).send('Something went wrong :(');
        }
        return;
    }

    // process has been completed
    const parsedData: CombinedDataParserOutput = dataParser.getData(
        OutputDataType.ALL
    ) as CombinedDataParserOutput;

    res.json(DataEndpoint.unionData(parsedData as EndpointData));
    console.log(dataParser.getFilePath());
    console.log('upload succesful');
}

module.exports = uploadRouter;
