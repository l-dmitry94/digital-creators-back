import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import columnServices from '../services/columnServices.js';

export const createColumn = async (req, res) => {
    const { _id: owner } = req.user;
    const ref_board = req.baseUrl.split('/')[3];
    const column_name = req.body;
    const column = await columnServices.findColumn({ column_name });
    if (column) throw HttpError(409, 'Сolumn name in use');

    const data = await columnServices.addColumn({ ...req.body, ref_board, owner });
    res.status(201).json(data);
};

export const updateColumn = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const data = await columnServices.updateColumnByFilter({ owner, _id: id }, req.body);
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createColumn: ctrlWrapper(createColumn),
    updateColumn: ctrlWrapper(updateColumn),
};
