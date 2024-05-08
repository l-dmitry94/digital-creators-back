import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'fs/promises';
import cloudinary from '../helpers/cloudinary.js';
import authServices from '../services/authServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import createVerifyEmail from '../helpers/createVerifyEmail.js';
import sendEmail from '../helpers/sendMail.js';

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) throw HttpError(409, 'Email in use');

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    // const verificationToken = nanoid();

    const payload = { email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });

    const newUser = await authServices.signup({ ...req.body, password: hashPassword, avatarURL, token });

    // const verifyEmail = createVerifyEmail(email, verificationToken);
    // await sendEmail(verifyEmail);

    res.status(201).json({
        token,
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

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(404, 'Email not found');
    }
    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const verifyEmail = createVerifyEmail(email, user.verificationToken);
    await sendEmail(verifyEmail);

    res.json({
        message: 'Verification email sent',
    });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) throw HttpError(401, 'Email or password is wrong');
    // if (!user.verify) throw HttpError(401, 'Email not verify');

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');

    const { _id: id } = user;
    const payload = { email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: {
            username: user.username,
            email: user.email,
            avatarURL: user.avatarURL,
        },
    });
};

const updateAvatar = async (req, res) => {
    const { username, email, password } = req.body;
    const { _id, avatar_id: oldAvatarId, password: passwordUser, email: emailUser, username: nameUser } = req.user;
    const user = await authServices.findUser({ email });

    if (user) {
        await fs.unlink(req.file.path);
        throw HttpError(409, 'Email in use');
    }
    const updateName = username ? username : nameUser;
    const updateEmail = email ? email : emailUser;
    if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password))
            throw HttpError(
                400,
                'Validation failed: password: Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, and one digit'
            );
    }

    const hashPasword = password ? await bcrypt.hash(password, 10) : passwordUser;
    if (!req.file) {
        const result = await authServices.updateUser(
            { _id },
            { username: updateName, email: updateEmail, password: hashPasword }
        );
        res.status(201).json(result);
        return;
    }
    const { url: avatarURL, public_id: avatar_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 65,
        height: 65,
        crop: 'fill',
        gravity: 'auto',
    });
    req.avatar = avatar_id;
    const result = await authServices.updateUser(
        { _id },
        { avatarURL, avatar_id, username: updateName, email: updateEmail, password: hashPasword }
    );

    const previousAvatarURL = oldAvatarId;
    await cloudinary.api.delete_resources(previousAvatarURL);
    await fs.unlink(req.file.path);

    res.json(result);
};

const getCurrent = async (req, res) => {
    const { username, email } = req.user;
    res.json({
        user: {
            username,
            email,
        },
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: null });
    res.status(204).send();
};

const supportSendEmail = async (req, res) => {
    const { email, value } = req.body;

    const supportEmail = 'orellesha9@gmail.com';

    const user = await authServices.findUser({ email });

    // if (!user) {
    //   throw HttpError(404, "Email not found");
    // }

    if (!user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const sendUserEmail = {
        to: email,
        subject: 'Task Pro/Technical support',
        html: `<p>We have received your request for help, expect our expert to contact you soon<p>`,
    };
    const sendSupportEmail = {
        to: supportEmail,
        subject: 'Need help',
        html: `<p>${value}<p>
      <p>User email: ${email}<p>`,
    };

    await sendEmail(sendUserEmail);
    await sendEmail(sendSupportEmail);

    res.json({
        message: 'Email sent',
    });
};

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signin: ctrlWrapper(signin),
    updateAvatar: ctrlWrapper(updateAvatar),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    supportSendEmail: ctrlWrapper(supportSendEmail),
};
