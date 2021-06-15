import {
    logToken,
    request,
    getToken,
    getSupervisors,
    getChildren,
    retractPermission,
    getApproved,
    checkSupervisor
} from '../utils/supervisorUtils';
import Router from 'express';

const supervisorRouter = Router();

supervisorRouter.post('/logToken', (req: any, res: any) => {
    if (!req.query.email || !req.query.token) {
        return res
            .status(404)
            .json({ success: false, message: 'Please provide email address and token' });
    }
    const success = logToken(req.query.email, req.query.token);

    if (success) {
        return res.status(200).json({ success: true, email: req.query.email });
    } else {
        return res
            .status(400)
            .json({ success: false, message: 'Something went wrong, please try again later' });
    }
});

supervisorRouter.post('/request', (req: any, res: any) => {
    if (!req.body.supervisorEmail || !req.body.childEmail) {
        return res
            .status(404)
            .json({ success: false, message: 'Please provide supervisor email and child email' });
    }
    const confirm = req.body.confirm;
    let success = false;

    if (confirm) {
        success = request(req.body.supervisorEmail, req.body.childEmail, confirm);
    } else {
        success = request(req.body.supervisorEmail, req.body.childEmail);
    }
    if (success) {
        return res.status(200).json({ success: true });
    } else {
        return res
            .status(400)
            .json({ success: false, message: 'Something went wrong, please try again later' });
    }
});

supervisorRouter.get('/getToken', (req: any, res: any) => {
    if (!req.query.supervisorEmail || !req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide both emails' });
    }
    const token = getToken(req.query.childEmail, req.query.supervisorEmail);
    return res.status(200).json({ token: token });
});

supervisorRouter.get('/getSupervisors', (req: any, res: any) => {
    if (!req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide child email' });
    }
    const supervisors = getSupervisors(req.query.childEmail);
    return res.status(200).json({ supervisors: supervisors });
});

supervisorRouter.get('/getApproved', (req: any, res: any) => {
    if (!req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide child email' });
    }
    const supervisors = getApproved(req.query.childEmail);

    return res.status(200).json({ supervisors: supervisors });
});

supervisorRouter.get('/getChildren', (req: any, res: any) => {
    if (!req.query.supervisorEmail) {
        return res.status(404).json({ success: false, message: 'Please provide supervisor email' });
    }
    const children = getChildren(req.query.supervisorEmail);

    return res.status(200).json({ children: children });
});

supervisorRouter.post('/retractPermission', (req: any, res: any) => {
    if (!req.query.supervisorEmail || !req.query.childEmail) {
        return res
            .status(404)
            .json({ success: false, message: 'Please provide supervisor email and child email' });
    }
    const success = retractPermission(req.body.childEmail, req.body.supervisorEmail);

    if (success) {
        return res.status(200).json({ success: true });
    }
    return res
        .status(400)
        .json({ success: false, message: 'Something went wrong, please try again later' });
});

supervisorRouter.get('/role', (req: any, res: any) => {
    if (!req.query.email) {
        return res.status(404).json({ success: false, message: 'Please provide an email' });
    }
    const sup = checkSupervisor(req.query.email);

    return res.status(200).json({ supervisor: sup });
});

module.exports = supervisorRouter;
