import boardServices from '../services/boardServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import getBgImg from '../helpers/getBgImg.js';

export const createBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const { icon, board_name, background: image } = req.body;
    const boardsByOwner = await boardServices.getAllBoards({ owner });
    const nameBoard = boardsByOwner.some(board => board.board_name === board_name);
    if (nameBoard) throw HttpError(409, `The name: " ${board_name} " already exist`);
    const body = { ...req.body, owner };
    if (icon) body.icon = icon;
    if (image) body.background = await getBgImg(image);
    const data = await boardServices.addBoard(body);
    res.status(201).json(data);
};
// ------------------------------------------------------------------------------

export const updateBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const newName = req.body?.board_name;
    if (newName) {
        const { board_name } = await boardServices.getBoardByFilter({ owner, _id: id });
        if (!board_name) throw HttpError(404, 'Not found');
        if (board_name === newName) throw HttpError(409, 'Change board name');
    }
    const data = await boardServices.updateBoardByFilter({ owner, _id: id }, req.body);
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export const deleteBoardById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const data = await boardServices.removeBoardByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    res.status(204).send();
};

export const getAllBoards = async (req, res) => {
    const { _id: owner } = req.user;
    const data = await boardServices.getAllBoards({ owner });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export const getBoardById = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const data = await boardServices.getBoardByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createBoard: ctrlWrapper(createBoard),
    updateBoard: ctrlWrapper(updateBoard),
    deleteBoardById: ctrlWrapper(deleteBoardById),
    getAllBoards: ctrlWrapper(getAllBoards),
    getBoardById: ctrlWrapper(getBoardById),
};
