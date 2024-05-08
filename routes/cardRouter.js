import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
// import isValidId from '../middlewares/isValidId.js';
import { cardCreateSchema } from '../schemas/cardsSchemas.js';
import cardControllers from '../controllers/cardControllers.js';

const cardRouter = express.Router();

cardRouter.use(authenticate);

cardRouter.post('/', validateBody(cardCreateSchema), cardControllers.createCard);

export default cardRouter;
