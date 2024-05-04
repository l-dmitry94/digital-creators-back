import cloudinary from '../helpers/cloudinary.js';
import { uploadService } from '../services/uploadService.js';
import HttpError from '../helpers/HttpError.js';
import fs from 'fs/promises';

export const addAvatar = async (req, res, next) => {
    try {
        // const { _id: owner } = req.user;

        //    await cloudinary.image(previousAvatarURL).destroy()
        const { url: avatar, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: 'avatars',
                width: 65,
                height: 65,
                crop: 'fill',
                gravity: 'auto',
            }
        );
        // const previousAvatarURL = public_id;
        // await cloudinary.api.delete_resources(previousAvatarURL);
      

        await fs.unlink(req.file.path);
        const result = await uploadService({ avatar, public_id }); //update user avatar
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getFolder = async (req, res, next) => {
    try {
        const { folder } = req.params;
        const { resources } = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${folder}`,
            max_results: 15,
        });
        res.json({ resources });
    } catch (error) {
        next(error);
    }
};
export const changeBackground = async (req, res, next) => {
    try {
        // const { _id: owner } = req.user;
        const { image } = req.query;
        if (!image) throw HttpError(400);
        const result = await cloudinary.api.resource(image);
        //update user background
        res.json({ result });
    } catch (error) {
        next(error);
    }
};
