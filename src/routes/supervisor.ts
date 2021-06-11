import {
    logToken,
    request,
    getTokens,
    getSupervisors,
    getChildren,
    retractPermission
} from '../utils/supervisorUtils';
import Router from 'express';

const supervisorRouter = Router();

supervisorRouter.post('/logToken', async (req: any, res: any) => {
    const success = await logToken(req.query.email, req.query.token);

    if (success) {
        return res.status(200).json({ success: true, email: req.query.email });
    } else {
        return res
            .status(400)
            .json({ success: false, message: 'Something went wrong, please try again later' });
    }
});

supervisorRouter.post('/request', async (req: any, res: any) => {
  let confirm = req.body.confirm;
  let success = false;
  // console.log("query: " + req.query.supervisorEmail);
  // console.log("body: " + req.body.supervisorEmail);
  if (confirm) {
    success = await request(req.body.supervisorEmail, req.body.childEmail, confirm)
  } else {
    success = await request(req.body.supervisorEmail, req.body.childEmail);
  }
  if (success) {
    return res.status(200).json({ success: true })
  } else {
    return res.status(400).json({ success: false, message: "Something went wrong, please try again later" });
  }
});

supervisorRouter.get('/getTokens', async (req: any, res: any) => {
    const tokens = await getTokens(req.query.supervisorEmail);
    return res.status(200).json({ tokens: tokens });
});

supervisorRouter.get('/getSupervisors', async (req: any, res: any) => {
    const supervisors = await getSupervisors(req.query.childEmail);
    return res.status(200).json({ supervisors: supervisors });
});

supervisorRouter.get('/getApproved', async (req: any, res:any) => {
  const supervisors = await getApproved(req.query.childEmail);

  return res.status(200).json({ supervisors: supervisors });
});

supervisorRouter.get('/getChildren', async (req: any, res:any) => {
  const children = await getChildren(req.query.supervisorEmail);

  return res.status(200).json({ children: children });
});

supervisorRouter.post('/retractPermission', async (req: any, res:any) => {
  const success = await retractPermission(req.body.childEmail, req.body.supervisorEmail);

    if (success) {
        return res.status(200).json({ success: true });
    }
    return res
        .status(400)
        .json({ success: false, message: 'Something went wrong, please try again later' });
});

module.exports = supervisorRouter;
