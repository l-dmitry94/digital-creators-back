import Joi from 'joi';

import { usernameRegexp, emailRegexp, passwordRegexp } from '../constants/userConstants.js';

export const userSignupSchema = Joi.object({
    username: Joi.string().pattern(usernameRegexp).message('username invalid').required(),
    email: Joi.string().pattern(emailRegexp).message('email invalid').required(),
    password: Joi.string().pattern(passwordRegexp).message('password invalid').required(),
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().pattern(passwordRegexp).required(),
});

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    value: Joi.string(),
});
