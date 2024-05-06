import { Router } from 'express';
import { getFolder, changeBackground } from '../controllers/uploadControllers.js';
import authenticate from '../middlewares/authenticate.js';
const uploadsRouter = Router();

uploadsRouter.get('/folders/:folder', getFolder); //"mobile_bg", "tablet_bg", "desktop_bg" - dinamic endpoint for recive the list of background images
uploadsRouter.patch('/background', authenticate, changeBackground); //here use query parametr. Example (image = "water_surface").Full example(http://localhost:3000/api/user/background?image=water_surface)
export default uploadsRouter;
