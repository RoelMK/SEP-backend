import multer from "multer";
import Router from "express";
import AbbottParser from "../services/dataParsers/abbottParser";
import { OutputDataType } from "../services/dataParsers/dataParser";
import path from "node:path";

const upload = multer({ dest: 'uploads/csv/' });
const uploadRouter = new Router();


uploadRouter.post('/upload-csv', upload.single('file'), function (req, res) {
    let abbottParser: AbbottParser = new AbbottParser(req.file.path)
    res.send(abbottParser.getData(OutputDataType.GLUCOSE));
});

uploadRouter.get('/upload-csv', function (req, res) {
    res.sendFile(path.join(__dirname, "/testHTML.html"));
});

module.exports = uploadRouter;