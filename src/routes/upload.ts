import multer from 'multer';
import Router from 'express';
import AbbottParser from '../services/dataParsers/abbottParser';
import { DataParser, InputError, OutputDataType } from '../services/dataParsers/dataParser';
import fs from 'fs';
import { getFileDirectory } from '../services/utils/files';
import FoodDiaryParser from '../services/dataParsers/foodDiaryParser';
import { EetMeterParser } from '../services/dataParsers/eetmeterParser';

const upload = multer({ dest: 'uploads/' });
const uploadRouter = Router();

// for uploading Abbott glucose logs, which may also contain insulin and more
uploadRouter.post('/upload', upload.single('file'), function (req: any, res) {
    const filePath: string = getFileDirectory(req.file.path, false) + '\\' + req.file.originalname; // filename is not transferred automatically
    switch (req.query.format) {
        case 'eetmeter':
            uploadFile(req, res, new EetMeterParser(filePath));
            break;
        case 'abbott':
            uploadFile(req, res, new AbbottParser(filePath));
            break;
        case 'fooddiary':
            uploadFile(req, res, new FoodDiaryParser(filePath));
            break;
        default:
            res.status(400).send('This data format is not supported');
    }
});

uploadRouter.get('/upload/abbott', function (req, res) {
    res.sendFile(__dirname + '/testHTMLabbott.html');
});

uploadRouter.get('/upload/fooddiary', function (req, res) {
    res.sendFile(__dirname + '/testHTMLfooddiary.html');
});

uploadRouter.get('/upload/eetmeter', function (req, res) {
    res.sendFile(__dirname + '/testHTMLeetmeter.html');
});

async function uploadFile(req, res, dataParser: DataParser) {
    //rename auto-generated file path to original name
    fs.rename(req.file.path, dataParser.getFilePath(), async function (err) {
        // if renaming fails for some reason, send error
        if (err) {
            console.log('ERROR: ' + err);
            res.status(500).send('Could not store file!');
            return;
        }

        // parse the uploaded file and update response on failure
        try {
            await parseUploadedfile(dataParser);
        } catch (e) {
            console.log('ERROR' + e);
            if (e.name == 'InputError') {
                res.status(400).send(
                    `An erroneous file was uploaded for the selected format, check if you have selected the correct file! Reason: ${e.message}`
                );
                return;
            }
            res.status(500).send('Something went wrong :(');
            return;
        }

        // remove file and update response if something fails
        try {
            removeUploadedFile(dataParser.getFilePath());
        } catch (e) {
            res.status(500).send(`Cannot delete file ${dataParser.getFilePath()}!`);
            return;
        }

        res.status(200).send('File has been parsed.');
        console.log('upload succesful');
    });
}

/**
 * Removes a file from the server
 * @param filePath Path of the file on the server
 */
function removeUploadedFile(filePath: string): void {
    // remove the temporary file
    fs.unlink(filePath, function (err) {
        if (err) {
            console.log(`Cannot delete file ${filePath}!`);
            throw err;
        }
    });
}

/**
 * Makes sure the uploaded file is parsed and processed correctly
 * @param dataParser DataParser child that handles the parsing of the file
 */
async function parseUploadedfile(dataParser: DataParser): Promise<void> {
    await dataParser.process();

    // TODO just for testing, get some insulin data and send it back
    const insulinData: any = dataParser.getData(OutputDataType.INSULIN);
    //const foodData: any = dataParser.getData(OutputDataType.FOOD);

    // only for testing
    // res.send(
    //     'Success, read ' +
    //         insulinData.length +
    //         ' entries.' +
    //         '\nFirst entry: ' +
    //         insulinData[0].timestamp +
    //         ', ' +
    //         insulinData[0].insulinAmount
    // );
    // res.send(
    //     'Success, read ' +
    //         insulinData.length +
    //         ' entries.' +
    //         '\nFirst entry: ' +
    //         foodData[0].timestamp +
    //         ', ' +
    //         foodData[0].carbohydrates
    // );
}

module.exports = uploadRouter;
