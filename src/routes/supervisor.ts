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
/**
 * Post endpoint to log the token of a user
 * Query parameters:
 * email user's GameBus email
 * token token to be logged
 */
supervisorRouter.post('/logToken', (req: any, res: any) => {
    if (!req.body.email || !req.body.token) {
        return res
            .status(404)
            .json({ success: false, message: 'Please provide email address and token' });
    }
    const success = logToken(req.body.email, req.body.token);

    if (success) {
        return res.status(200).json({ success: true, email: req.body.email });
    } else {
        // No success for logging token -> 400
        return res
            .status(400)
            .json({ success: false, message: 'Something went wrong, please try again later' });
        // Also include message for logging token error
    }
});

/**
 * Post endpoint for requesting supervisor role
 * Query parameters:
 * supervisorEmail GameBus email of the (future) supervisor user
 * childEmail GameBus email of the supervised user
 */
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
        // No success for requesting role -> 400
        return res
            .status(400)
            .json({ success: false, message: 'Something went wrong, please try again later' });
        // Also include message for requesting role
    }
});

/**
 * Get endpoint for retrieving a token for a user
 * Query parameters:
 * supervisorEmail GameBus email of the supervisor
 * childEmail GameBus email of the supervised user
 */
supervisorRouter.get('/getToken', (req: any, res: any) => {
    if (!req.query.supervisorEmail || !req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide both emails' });
    }
    const token = getToken(req.query.childEmail, req.query.supervisorEmail);
    return res.status(200).json({ token: token });
});

/**
 * Get all requested supervisors of a user
 * Query parameters:
 * childEmail email of the user for which the supervisor need to be retrieved
 */
supervisorRouter.get('/getSupervisors', (req: any, res: any) => {
    if (!req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide child email' });
    }
    const supervisors = getSupervisors(req.query.childEmail);
    return res.status(200).json({ supervisors: supervisors });
});

/**
 * Get all approved supervisors of a user
 * Query parameters:
 * childEmail email of the user for which the supervisor need to be retrieved
 */
supervisorRouter.get('/getApproved', (req: any, res: any) => {
    if (!req.query.childEmail) {
        return res.status(404).json({ success: false, message: 'Please provide child email' });
    }
    const supervisors = getApproved(req.query.childEmail);

    return res.status(200).json({ supervisors: supervisors });
});

/**
 * Get all supervised 'children' of a user
 * Query parameters:
 * supervisorEmail email of the supervisor for which the supervised users need to be retrieved
 */
supervisorRouter.get('/getChildren', (req: any, res: any) => {
    if (!req.query.supervisorEmail) {
        return res.status(404).json({ success: false, message: 'Please provide supervisor email' });
    }
    const children = getChildren(req.query.supervisorEmail);

    return res.status(200).json({ children: children });
});

/**
 * Post endpoint to retract supervisor permission
 * Query parameters:
 * supervisorEmail email of the supervisor for which the supervised users need to be retrieved
 * childEmail email of the user for which the supervisor need to be retrieved
 */
supervisorRouter.post('/retractPermission', (req: any, res: any) => {
    if (!req.body.supervisorEmail || !req.body.childEmail) {
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

/**
 * Get endpoint to retrieve role of current user
 * Query parameters:
 * email user's GameBus email
 */
supervisorRouter.get('/role', (req: any, res: any) => {
    if (!req.query.email) {
        return res.status(404).json({ success: false, message: 'Please provide an email' });
    }
    const sup = checkSupervisor(req.query.email);

    return res.status(200).json({ supervisor: sup });
});

module.exports = supervisorRouter;
