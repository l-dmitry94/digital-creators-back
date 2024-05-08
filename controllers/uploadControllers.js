import cloudinary from '../helpers/cloudinary.js';
import HttpError from '../helpers/HttpError.js';

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
        const prefixes = [`desktop_bg/${image}`, `tablet_bg/${image}`, `mobile_bg/${image}`];
        const promises = prefixes.map(prefix =>
            cloudinary.api.resources({
                type: 'upload',
                prefix: prefix,
                max_results: 3,
            })
        );

        const [a, b, c] = await Promise.all(promises);
        const { resources: dekstop } = a;
        const { resources: tablet } = b;
        const { resources: mobile } = c;
        res.json({ dekstop: dekstop[0], tablet: tablet[0], mobile: mobile[0] });
    } catch (error) {
        next(error);
    }
};
