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
    const { card_name } = req.body;
    const isCardExist = await cardServices.getCardByFilter({ owner, _id: id });
    if (!isCardExist) throw HttpError(404, 'Card not  found');
    if (isCardExist.card_name !== card_name) {
        const cardsByOwner = await cardServices.getAllCards({ owner });
        const nameCard = cardsByOwner.some(card => card.card_name === card_name);
        if (nameCard) throw HttpError(409, `The name: " ${card_name} " already exist`);
    }
    const data = await cardServices.updateCardByFilter({ owner, _id: id }, req.body);
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export const deleteCardById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const data = await cardServices.removeCardByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    res.status(204).send();
};

export const getAllCards = async (req, res) => {
    const { _id: owner } = req.user;
    const baseUrl = req.baseUrl.split('/');
    const ref_board = baseUrl[3];
    const data = await cardServices.getAllCards({ owner, ref_board });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export const getCardById = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const data = await cardServices.getCardByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};
export const changeCardColumnById = async (req, res) => {
    const { _id: owner } = req.user;
    const { card_id, newColumn } = req.body;
    const data = await cardServices.updateCardByFilter({ owner, _id: card_id }, { ref_column: newColumn });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createCard: ctrlWrapper(createCard),
    updateCard: ctrlWrapper(updateCard),
    deleteCardById: ctrlWrapper(deleteCardById),
    getAllCards: ctrlWrapper(getAllCards),
    getCardById: ctrlWrapper(getCardById),
    changeCardColumnById: ctrlWrapper(changeCardColumnById),
};
