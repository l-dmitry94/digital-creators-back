import { Schema, model } from 'mongoose';

const uploadSchema = new Schema(
    {
        avatar: { type: String },
    },
    { versionKey: false, timestamps: true }
);

const Avatar = model('avatar', uploadSchema);
export default Avatar