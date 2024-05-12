import { Schema, model } from 'mongoose';
import { handleServerError, setUpdateSettings } from './hooks.js';

const boardSchema = new Schema(
    {
        board_name: {
            type: String,
            required: [
                function () {
                    return this.isNew ? true : false;
                },
                'Board name is required',
            ],
        },
        icon: {
            type: String,
            default: null,
        },
        background: {
            type: Schema.Types.Mixed,
            default: null,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

boardSchema.pre('findOneAndUpdate', setUpdateSettings);
boardSchema.post('save', handleServerError);
boardSchema.post('findOneAndUpdate', handleServerError);

const Board = model('board', boardSchema);

export default Board;

// task
// Структура :
//  user_id
//      board name
//      board id
//      ref: user {user_id}
//      icon active
//      background
//          colum name
//          colum_id
//          ref: board {board_id}
//              card name
//              card_id
//              description
//              ref: colum {colum_id}
//              label
//              date
//
//              card name
//              card_id
//              description
//              ref: colum {colum_id}
//              label
//              date
