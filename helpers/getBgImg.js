import cloudinary from './cloudinary.js';
import HttpError from './HttpError.js';

const getBgImg = async image => {
    const prefixes = [`desktop_bg/${image}`, `tablet_bg/${image}`, `mobile_bg/${image}`];
    const promises = prefixes.map(prefix =>
        cloudinary.api.resources({
            type: 'upload',
            prefix: prefix,
            max_results: 3,
        })
    );
    const responses = await Promise.all(promises);
    const [desktop, tablet, mobile] = responses.map(({ resources }) => resources[0]);
    if (!desktop) throw HttpError(400, `The: " ${image} " property of background incorrect`);
    const background = { desktop: desktop.secure_url, tablet: tablet.secure_url, mobile: mobile.secure_url };
    return background;
};

export default getBgImg;
