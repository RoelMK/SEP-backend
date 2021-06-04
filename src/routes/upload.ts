import multer from 'multer';
import Router from 'express';
import AbbottParser from '../services/dataParsers/abbottParser';
import { DataParser, OutputDataType } from '../services/dataParsers/dataParser';
import fs from 'fs';
import { getFileDirectory } from '../services/utils/files';
import FoodDiaryParser from '../services/dataParsers/foodDiaryParser';
import { EetMeterParser } from '../services/dataParsers/eetmeterParser';

const upload = multer({ dest: 'uploads/' });
const uploadRouter = Router();

// for uploading Abbott glucose logs, which may also contain insulin and more
uploadRouter.post('/upload', upload.single('file'), function (req, res) {
    switch (req.query.format) {
        case 'eetmeter':
            uploadFile(req, res, new EetMeterParser());
            break;
        case 'abbott':
            uploadFile(req, res, new AbbottParser());
            break;
        case 'fooddiary':
            uploadFile(req, res, new FoodDiaryParser());
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
    // prepare file path with extension
    const filePath: string = getFileDirectory(req.file.path, false) + '\\' + req.file.originalname; // filename is not transferred automatically
    dataParser.setFilePath(filePath);

    console.log('HIER' + filePath + '   ' + req.file.path);

    //rename file path to include extension
    fs.rename(req.file.path, filePath, async function (err) {
        // if renaming fails for some reason, send error // TODO
        if (err) {
            console.log('ERROR: ' + err);
            res.status(500).send('Could not store file!'); // TODO
            return;
        }

        // parse the uploaded file and update response
        res = await parseUploadedfile(dataParser, res);

        // remove file and update respons if something fails
        removeUploadedFile(filePath);

        console.log('upload succesful');
    });
}

/**
 * Removes a file from the server
 * @param filePath Path of the file on the server
 */
function removeUploadedFile(filePath: string) {
    // remove the temporary file
    fs.unlink(filePath, function (err) {
        if (err) {
            console.log(`Cannot delete file ${filePath}!`);
            return; //TODO cannot remove, probably not best to send an error and just leave it
        }
    });
}

async function parseUploadedfile(dataParser: DataParser, res) {
    // rest of the function is included in this function to synchronize the control flow
    try{
        await dataParser.process();
    } catch(e){
        res.status(500).send('Something went wrong');
    }

    // TODO just for testing, get some insulin data and send it back
    const insulinData: any = dataParser.getData(OutputDataType.INSULIN);
    //const foodData: any = dataParser.getData(OutputDataType.FOOD);

    // only for testing
    res.send(
        'Success, read ' +
            insulinData.length +
            ' entries.' +
            '\nFirst entry: ' +
            insulinData[0].timestamp +
            ', ' +
            insulinData[0].insulinAmount
    );
    // res.send(
    //     'Success, read ' +
    //         insulinData.length +
    //         ' entries.' +
    //         '\nFirst entry: ' +
    //         foodData[0].timestamp +
    //         ', ' +
    //         foodData[0].carbohydrates
    // );
    return res;
}

module.exports = uploadRouter;
