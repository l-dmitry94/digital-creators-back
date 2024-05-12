import cloudinary from '../helpers/cloudinary.js';

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
