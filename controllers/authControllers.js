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

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, 'Email not found or already verified');
    }

    await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: null });

    res.json({
        message: 'Verification successful',
    });
};

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
};
