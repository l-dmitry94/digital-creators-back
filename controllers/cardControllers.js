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

export const updateCard = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const { card_name: newName } = req.body?.card_name;
    if (newName) {
        const { card_name } = await cardServices.getCardByFilter({ owner, _id: id });
        if (!card_name) throw HttpError(404, 'Not found');
        if (card_name === newName) throw HttpError(409, 'Change card name');
    }
    const data = await cardServices.updateCardByFilter({ owner, _id: id }, req.body);
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createCard: ctrlWrapper(createCard),
    updateCard: ctrlWrapper(updateCard),
};
