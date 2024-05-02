// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import HttpError from '../helpers/HttpError.js';
// import * as authServices from '../services/authServices.js';
// import gravatar from 'gravatar';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import fs from 'fs/promises';
import path from 'path';
// import Jimp from 'jimp';
// import { nanoid } from 'nanoid';
import sendEmail from '../helpers/sendMail.js';
// const { JWT_SECRET, PROJECT_URL } = process.env;

// const posterPath = path.resolve('public', 'avatars');

const supportSendEmail = async (req, res) => {
    const { email,value } = req.body;

    const supportEmail = "orellesha9@gmail.com"
    console.log(req.body);
    // const user = await authServices.findUser({ email });
    // if (!user) {
    //   throw HttpError(404, "Email not found");
    // }

    // if (user.verify) {
    //   throw HttpError(400, "Verification has already been passed");
    // }

    const sendUserEmail = {
        to: email,
        subject: 'Technical support',
        html: `<p>We have received your request for help, expect our expert to contact you soon<p>`,
    };
    const sendSupportEmail = {
      to: supportEmail,
      subject: 'Need help',
      html: `<p>${value}<p>
      <p>User email: ${email}<p>`
  };

  await sendEmail(sendUserEmail)
  await sendEmail(sendSupportEmail)
  
    res.json({
        message: 'Email sent',
    });
};

export default {
    supportSendEmail: ctrlWrapper(supportSendEmail),
};
