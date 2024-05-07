import Board from '../models/Bord.js';

export const listBoards = (filter, settings) =>
    Board.find(filter, null, settings).populate('owner', 'email subscription');

export const addBoard = data => Board.create(data);

export const removeBoardByFilter = filter => Board.findOneAndDelete(filter);

export default { listBoards, addBoard, removeBoardByFilter };
