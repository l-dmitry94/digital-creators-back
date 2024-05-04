import cloudinary from '../helpers/cloudinary.js';
import HttpError from '../helpers/HttpError.js';
import authService from '../services/authServices.js';
import fs from 'fs/promises';

export const addAvatar = async (req, res, next) => {
    try {
        const { _id, avatar_id: oldAvatarId } = req.user;
        const { url: avatarURL, public_id: avatar_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: 'avatars',
            width: 65,
            height: 65,
            crop: 'fill',
            gravity: 'auto',
        });
        const result = await authService.updateUser({ _id }, { avatarURL, avatar_id });
        const previousAvatarURL = oldAvatarId;
        await cloudinary.api.delete_resources(previousAvatarURL);
        await fs.unlink(req.file.path);
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
        const { image } = req.query;
        if (!image) throw HttpError(400);
        const result = await cloudinary.api.resource(image);
        res.json({ result });
    } catch (error) {
        next(error);
    }
};
