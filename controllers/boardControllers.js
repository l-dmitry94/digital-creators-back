import boardServices from '../services/boardServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import getBgImg from '../helpers/getBgImg.js';
import validateBoardName from '../helpers/validateBoardName.js';

export const createBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const { icon, board_name, background: image } = req.body;
    await validateBoardName(owner, board_name);
    const body = { ...req.body, owner };
    if (icon) body.icon = icon;
    body.background = image === 'default' ? 'default' : await getBgImg(image);
    const data = await boardServices.addBoard(body);
    res.status(201).json(data);
};
// ------------------------------------------------------------------------------

export const updateBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const { icon, board_name, background: image } = req.body;
    const isBoardExist = await boardServices.getBoardByFilter({ owner, _id: id });
    if (!isBoardExist) throw HttpError(404, 'Board not  found');
    if (isBoardExist.board_name !== board_name) {
    }
    await validateBoardName(owner, board_name);
    const body = { ...req.body, owner, image };
    if (board_name == '') body.board_name = isBoardExist.board_name;
    if (icon) body.icon = icon;
    body.background = image === 'default' ? 'default' : await getBgImg(image);
    const data = await boardServices.updateBoardByFilter({ owner, _id: id }, body);
    res.json(data);
};
//--------------------------------------------------------------------------------
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
