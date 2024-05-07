import Board from '../models/Bord.js';

export const listBoards = (filter, settings) =>
    Board.find(filter, null, settings).populate('owner', 'email subscription');

export const addBoard = data => Board.create(data);

export default { listBoards, addBoard };
