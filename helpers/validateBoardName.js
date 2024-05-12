import boardServices from '../services/boardServices.js';
import HttpError from './HttpError.js';
const validateBoardName = async (owner, board_name) => {
    const boardsByOwner = await boardServices.getAllBoards({ owner });
    const nameBoard = boardsByOwner.some(board => board.board_name === board_name);
    if (nameBoard) throw HttpError(409, `The name: " ${board_name} " already exist`);
};

export default validateBoardName;
