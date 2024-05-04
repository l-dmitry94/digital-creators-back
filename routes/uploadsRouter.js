import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { addAvatar, getFolder,changeBackground } from '../controllers/uploadControllers.js';
const uploadsRouter = Router();

uploadsRouter.patch('/avatar', upload.single('avatar'), addAvatar);//for changing avatar
uploadsRouter.get('/folders/:folder', getFolder); //"mobile_bg", "tablet_bg", "desktop_bg" - dinamic endpoint for recive the list of background images
uploadsRouter.patch('/background',changeBackground)//here use query parametr. Example (image = "mobile_bg/water_surface").Full example(http://localhost:3000/api/user/background?image=tablet_bg/water_surface)
export default uploadsRouter;
