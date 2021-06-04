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
    let promise: Promise<void>;
    switch (req.query.format) {
        case 'eetmeter':
            promise = uploadFile(req, res, new EetMeterParser(filePath));
            break;
        case 'abbott':
            promise = uploadFile(req, res, new AbbottParser(filePath));
            break;
        case 'fooddiary':
            promise = uploadFile(req, res, new FoodDiaryParser(filePath));
            break;
        default:
            res.status(400).send('This data format is not supported');
            try{fs.unlinkSync(req.file.path)}catch(e){};
            return;
    }
    // at the end of each upload, remove the file
    promise.then(() => {try{fs.unlinkSync(filePath);}catch(e){};})
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
    try{
        fs.renameSync(req.file.path, dataParser.getFilePath());
    }catch (e){
        console.log(e);
        try{fs.unlinkSync(req.file.path)}catch(e){};
        res.status(500).send('Could not rename file!');
        return;
    }

    // parse the uploaded file and update response on failure
    try {
        await parseFile(dataParser);
    } catch (e) {
        console.log(e);
        switch(e.name){
            case 'InputError':
                res.status(400).send(
                    `An erroneous file was uploaded for the selected format, check if you have selected the correct file! Reason: ${e.message}`
                );
                break;
            default:
                res.status(500).send('Something went wrong :(');
        }
        return;
    }

    console.log(dataParser.getFilePath())
    // process has been completed
    res.status(200).send('File has been parsed.');
    console.log('upload succesful');
}

/**
 * Makes sure the uploaded file is parsed and processed correctly
 * @param dataParser DataParser child that handles the parsing of the file
 */
async function parseFile(dataParser: DataParser): Promise<void> {
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
