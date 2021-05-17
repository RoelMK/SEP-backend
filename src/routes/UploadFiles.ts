import multer from "multer";
import Router from "express";
import AbbottParser from "../services/dataParsers/abbottParser";
import { DataParser, OutputDataType } from "../services/dataParsers/dataParser";
import fs from "fs";
import { getFileExtension } from "../services/utils/files";
import FoodDiaryParser from "../services/dataParsers/foodDiaryParser";

const upload = multer({ dest: 'uploads/abbott/' });
const uploadRouter = Router();


uploadRouter.post('/upload-abbott', upload.single('file'), function(req, res){uploadFile(req, res, new AbbottParser())});
uploadRouter.get('/upload-abbott', function (req, res) {
    res.sendFile(__dirname + "/testHTMLabbott.html");
});

uploadRouter.post('/upload-fooddiary', upload.single('file'), function(req, res){uploadFile(req, res, new FoodDiaryParser())});
uploadRouter.get('/upload-fooddiary', function (req, res) {
    res.sendFile(__dirname +"/testHTMLfooddiary.html");
});

async function uploadFile(req, res, dataParser: DataParser) {

    // prepare file path with extension
    const originalExtension: string = getFileExtension(req.file.originalname)
    const filePath: string = req.file.path + "." +originalExtension; // extension is not transferred automatically
    dataParser.setFilePath(filePath);

    //rename file path to include extension
    fs.rename(req.file.path, filePath , async function(err) {

        // if renaming fails for some reason, send error // TODO
        if ( err ) {
            console.log('ERROR: ' + err)
            res.status(500).send('Could not store file!'); // TODO
            return;
        }

        // rest of the function is included in this function to synchronize the control flow
        await dataParser.process();

        // TODO just for testing, get some insulin data and send it back
        const insulinData: any = dataParser.getData(OutputDataType.INSULIN);

        res.send(
            "Success, read " + insulinData.length + " entries." +
            "\nFirst entry: " + insulinData[0].timestamp + ", " + insulinData[0].insulinAmount
        ); 

        // check if file still exists (must be the case)
        fs.stat(filePath, function (err, stats) {     
            if (err) {
                res.status(500).send('Could not remove file, it does not exist!') // TODO
            }
        
            // remove the temporary file
            fs.unlink(filePath,function(err){
                if(err) res.status(500).send('Could not remove file!'); // TODO
            });  
        });
        console.log("Upload succesful")
    });
}



module.exports = uploadRouter;