import express from 'express';
import validateBody from '../decorators/validateBody.js';
import { userEmailSchema } from '../schemas/usersSchemas.js';
import authControllers from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

const supportRouter = express.Router();

supportRouter.post('/sendmail', validateBody(userEmailSchema), authenticate, authControllers.supportSendEmail);

export default supportRouter;
