import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import authServices from '../services/authServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import createVerifyEmail from '../helpers/createVerifyEmail.js';
import sendEmail from '../helpers/sendMail.js';

// const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) throw HttpError(409, 'Email in use');

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await authServices.signup({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = createVerifyEmail(email, verificationToken);
    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            username: newUser.username,
            email: newUser.email,
            avatarURL: newUser.avatarURL,
        },
    });
};

export default {
    signup: ctrlWrapper(signup),
};
