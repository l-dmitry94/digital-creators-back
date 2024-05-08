import { Schema, model } from 'mongoose';
import { handleServerError, setUpdateSettings } from './hooks.js';
import { usernameRegexp, emailRegexp, passwordRegexp } from '../constants/userConstants.js';

const userSchema = new Schema(
    {
        username: {
            type: String,
            match: usernameRegexp,
            required: [true, 'Username is required'],
        },
        email: {
            type: String,
            match: [emailRegexp, 'Email is invalid'],
            unique: true,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        avatarURL: {
            type: String,
            default: null,
        },
        avatar_id: {
            type: String,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('save', handleServerError);

userSchema.post('findOneAndUpdate', handleServerError);

const User = model('user', userSchema);

export default User;
