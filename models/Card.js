import { Schema, model } from 'mongoose';
import { handleServerError, setUpdateSettings } from './hooks.js';

const cardSchema = new Schema(
    {
        card_name: {
            type: String,
            required: [true, 'Card name is required'],
        },
        description: {
            type: String,
            default: null,
        },
        priority: {
            type: String,
            default: null,
            required: true,
        },
        deadline: {
            type: String,
            default: null,
            required: true,
        },
        ref_column: {
            type: Schema.Types.ObjectId,
            ref: 'column',
            required: true,
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

cardSchema.pre('findOneAndUpdate', setUpdateSettings);
cardSchema.post('save', handleServerError);
cardSchema.post('findOneAndUpdate', handleServerError);

const Card = model('card', cardSchema);

export default Card;
