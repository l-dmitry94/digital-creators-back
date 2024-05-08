import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
import { columnCreateUpdateSchema } from '../schemas/columnsSchemas.js';
import columnControllers from '../controllers/columnControllers.js';
import isValidId from '../middlewares/isValidId.js';

const columnRouter = express.Router();

columnRouter.use(authenticate);

columnRouter.post('/', validateBody(columnCreateUpdateSchema), columnControllers.createColumn);
columnRouter.patch('/:id', isValidId, validateBody(columnCreateUpdateSchema), columnControllers.updateColumn);
columnRouter.delete('/:id', isValidId, columnControllers.deleteColumnById);

export default columnRouter;
