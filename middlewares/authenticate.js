import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import authServices from '../services/authServices.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, 'Not authorized'));
    }

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return next(HttpError(401, 'Not authorized'));
    }
    try {
        const { email } = jwt.verify(token, SECRET_KEY);
        const userEmail = await authServices.findUser({ email });
        if (!userEmail) {
            return next(HttpError(401, 'User not found'));
        }

        if (!userEmail.token) {
            return next(HttpError(401, 'Not authorized'));
        }
        req.user = userEmail;
        next();
    } catch (error) {
        next(HttpError(401, 'Not authorized'));
    }
};

export default authenticate;
