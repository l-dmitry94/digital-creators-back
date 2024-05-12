import { Router } from 'express';
import { getFolder } from '../controllers/uploadControllers.js';
const uploadsRouter = Router();

uploadsRouter.get('/folders/:folder', getFolder); //"mobile_bg", "tablet_bg", "desktop_bg" - dinamic endpoint for recive the list of background images

export default uploadsRouter;
