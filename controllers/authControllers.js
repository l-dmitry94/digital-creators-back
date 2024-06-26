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
import { passwordRegexp } from '../constants/userConstants.js';

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) throw HttpError(409, 'Email in use');

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    // const verificationToken = nanoid();

    const newUser = await authServices.signup({ ...req.body, password: hashPassword, avatarURL, thema: 'dark' });

    // const verifyEmail = createVerifyEmail(email, verificationToken);
    // await sendEmail(verifyEmail);
    const payload = { email: newUser.email, id: newUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
    await authServices.updateUser({ _id: newUser._id }, { token });

    res.status(201).json({
        token,
        user: {
            username: newUser.username,
            email: newUser.email,
            thema: newUser.thema,
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
    const payload = { email, id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: {
            username: user.username,
            email: user.email,
            thema: user.thema,
            avatarURL: user.avatarURL,
        },
    });
};

const editProfile = async (req, res) => {
    const { username, email, password } = req.body;

    const { _id, avatar_id: oldAvatarId, password: passwordUser, email: emailUser, username: nameUser } = req.user;

    const user = await authServices.findUser({ email });
    if (user && !req.file) {
        throw HttpError(409, 'Email in use');
    }

    if (user) {
        await fs.unlink(req.file.path);
        throw HttpError(409, 'Email in use');
    }

    const updateName = username ? username : nameUser;
    const updateEmail = email ? email : emailUser;
    if (password) {
        if (!passwordRegexp.test(password))
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
    const { secure_url: avatarURL, public_id: avatar_id } = await cloudinary.uploader.upload(req.file.path, {
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
    const { username, email, avatarURL, thema } = req.user;
    res.json({
        username,
        email,
        thema,
        avatarURL,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: null });
    res.status(204).send();
};

const supportSendEmail = async (req, res) => {
    const { email, value } = req.body;

    const supportEmail = 'taskpro.project@gmail.com';

    const user = await authServices.findUser({ email });

    // if (!user) {
    //   throw HttpError(404, "Email not found");
    // }

    // if (!user.verify) {
    //     throw HttpError(400, 'Verification has already been passed');
    // }

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

export const updateThema = async (req, res) => {
    const { _id } = req.user;
    const { thema } = req.body;
    const data = await authServices.updateUser({ _id }, { thema });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

// const updateAvatar = async (req, res) => {
//   if (!req.file) throw HttpError(400, 'An avatar file was not added to your request');

//   const { _id } = req.user;
//   const { path: tempUpload, originalname } = req.file;

//   try {
//     const img = await Jimp.read(tempUpload);
//     await img.resize(250, 250).writeAsync(tempUpload);
//   } catch (error) {
//     console.error('Помилка обробки зображення:', error);
//     throw HttpError(500, 'Internal Server Error');
//   }

//   const filename = `${_id}_${originalname}`;
//   const resultUpload = path.join(avatarsDir, filename);
//   await fs.rename(tempUpload, resultUpload);
//   const avatarURL = path.join('avatars', filename);
//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.json({
//     avatarURL,
//   });
// };

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    signin: ctrlWrapper(signin),
    editProfile: ctrlWrapper(editProfile),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    supportSendEmail: ctrlWrapper(supportSendEmail),
    updateThema: ctrlWrapper(updateThema),
};
