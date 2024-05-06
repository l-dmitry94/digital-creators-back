import { Router } from 'express';
import {getAllBoards, deleteBoardById, createBoard} from '../controllers/boardControllers.js'
import authenticate from '../middlewares/authenticate.js';
const boardRouter = Router();

boardRouter.get('/', getAllBoards);
boardRouter.delete("/:id",  deleteBoardById);
boardRouter.post("/",authenticate, createBoard);

export default boardRouter