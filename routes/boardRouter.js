import { Router } from 'express';
import boardControllers from '../controllers/boardControllers.js';
import authenticate from '../middlewares/authenticate.js';
const boardRouter = Router();

// boardRouter.get('/', getAllBoards);
boardRouter.delete('/:id', authenticate, boardControllers.deleteBoardById);
boardRouter.post('/', authenticate, boardControllers.createBoard);

export default boardRouter;
