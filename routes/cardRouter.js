import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { cardCreateSchema, cardUpdateSchema } from '../schemas/cardsSchemas.js';
import cardControllers from '../controllers/cardControllers.js';

const cardRouter = express.Router();

cardRouter.use(authenticate);

cardRouter.post('/', validateBody(cardCreateSchema), cardControllers.createCard);
cardRouter.patch('/:id', isValidId, validateBody(cardUpdateSchema), cardControllers.updateCard);
cardRouter.delete('/:id', isValidId, cardControllers.deleteCardById);
cardRouter.get('/', cardControllers.getAllCards);
cardRouter.get('/:id', isValidId, cardControllers.getCardById);
cardRouter.get('/', isValidId, cardControllers.getAllCardsInBoard);

export default cardRouter;
