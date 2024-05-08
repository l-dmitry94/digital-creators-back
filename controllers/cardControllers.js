import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import cardServices from '../services/cardServices.js';

export const createCard = async (req, res) => {
    const { _id: owner } = req.user;
    const baseUrl = req.baseUrl.split('/');
    const ref_board = baseUrl[3];
    const ref_column = baseUrl[5];
    const data = await cardServices.addCard({ ...req.body, ref_column, ref_board, owner });
    res.status(201).json(data);
};

export default {
    createCard: ctrlWrapper(createCard),
};
