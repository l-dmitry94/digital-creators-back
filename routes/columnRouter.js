import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../decorators/validateBody.js';
import { columnCreateUpdateSchema } from '../schemas/columnsSchemas.js';
import columnControllers from '../controllers/columnControllers.js';

const columnRouter = express.Router();

columnRouter.use(authenticate);

columnRouter.post('/', validateBody(columnCreateUpdateSchema), columnControllers.createColumn);
columnRouter.patch('/columnId', validateBody(columnCreateUpdateSchema), columnControllers.updateColumn);

export default columnRouter;
