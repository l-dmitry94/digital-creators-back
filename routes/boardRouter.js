import express from 'express';
import boardControllers from '../controllers/boardControllers.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
import { boardCreateSchema, boardUpdateSchema } from '../schemas/boardsschemas.js';
import isValidId from '../middlewares/isValidId.js';

const boardRouter = express.Router();

boardRouter.use(authenticate);

boardRouter.post('/', validateBody(boardCreateSchema), boardControllers.createBoard);
boardRouter.patch('/:id', isValidId, validateBody(boardUpdateSchema), boardControllers.updateBoard);
boardRouter.delete('/:id', isValidId, boardControllers.deleteBoardById);
boardRouter.get('/', boardControllers.getAllBoards);
boardRouter.get('/:id', isValidId, boardControllers.getBoardById);

export default boardRouter;
