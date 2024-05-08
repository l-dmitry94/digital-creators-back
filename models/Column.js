import { Schema, model } from 'mongoose';
import { handleServerError, setUpdateSettings } from './hooks.js';

const columnSchema = new Schema(
    {
        column_name: {
            type: String,
            required: [true, 'Column name is required'],
            unique: true,
        },
        ref_board: {
            type: Schema.Types.ObjectId,
            ref: 'board',
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

columnSchema.pre('findOneAndUpdate', setUpdateSettings);
columnSchema.post('save', handleServerError);
columnSchema.post('findOneAndUpdate', handleServerError);

const Column = model('column', columnSchema);

export default Column;
