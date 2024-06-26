import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { cardColumUpdateSchema, cardCreateSchema, cardUpdateSchema } from '../schemas/cardsSchemas.js';
import cardControllers from '../controllers/cardControllers.js';

const cardRouter = express.Router();

cardRouter.use(authenticate);

cardRouter.post('/', validateBody(cardCreateSchema), cardControllers.createCard);
cardRouter.patch('/:id', isValidId, validateBody(cardUpdateSchema), cardControllers.updateCard);
cardRouter.delete('/:id', isValidId, cardControllers.deleteCardById);
cardRouter.get('/', cardControllers.getAllCards);
cardRouter.get('/:id', isValidId, cardControllers.getCardById);
cardRouter.patch(`/`, validateBody(cardColumUpdateSchema), cardControllers.changeCardColumnById);

export default cardRouter;
