import express from 'express';
const supportRouter = express.Router();
import validateBody from '../decorators/validateBody.js';
import { userEmailSchema } from '../schemas/usersSchemas.js';
import authControllers from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

supportRouter.post('/sendmail', validateBody(userEmailSchema), authControllers.supportSendEmail);

export default supportRouter;
