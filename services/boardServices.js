import Board from '../models/Bord.js';

export const addBoard = data => Board.create(data);

export const updateBoardByFilter = (filter, data) => Board.findOneAndUpdate(filter, data);

export const removeBoardByFilter = filter => Board.findOneAndDelete(filter);

export const getAllBoards = filter => Board.find(filter);

export const getBoardByFilter = filter => Board.findOne(filter);

export default {
    addBoard,
    updateBoardByFilter,
    removeBoardByFilter,
    getAllBoards,
    getBoardByFilter,
};
