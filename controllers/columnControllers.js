import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import cardServices from '../services/cardServices.js';
import columnServices from '../services/columnServices.js';

export const createColumn = async (req, res) => {
    const { _id: owner } = req.user;
    const baseUrl = req.baseUrl.split('/');
    const ref_board = baseUrl[3];
    const column_name = req.body;
    const column = await columnServices.getColumnByFilter({ owner, ref_board, ...column_name });
    if (column) throw HttpError(409, 'Сolumn name in use');
    const data = await columnServices.addColumn({ ...req.body, ref_board, owner });
    res.status(201).json(data);
};

export const updateColumn = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const { column_name } = req.body;
    // const newName = req.body?.column_name;
    // if (newName) {
    //     const { column_name } = await columnServices.getColumnByFilter({ owner, _id: id });
    //     if (!column_name) throw HttpError(404, 'Not found');
    //     if (column_name === newName) throw HttpError(409, 'Change column name');
    // }
    // ------------------
    const isColumnExist = await columnServices.getColumnByFilter({ owner, _id: id });
    if (!isColumnExist) throw HttpError(404, 'Column not  found');
    if (isColumnExist.column_name !== column_name) {
        const columnsByOwner = await columnServices.getAllColumns({ owner });
        const nameColumn = columnsByOwner.some(column => column.column_name === column_name);
        if (nameColumn) throw HttpError(409, `The name: " ${column_name} " already exist`);
    }
    // -------------------
    const data = await columnServices.updateColumnByFilter({ owner, _id: id }, req.body);
    res.json(data);
};

export const deleteColumnById = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const data = await columnServices.removeColumnByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    await cardServices.removeAllCardsByFilter({ owner, ref_column: id });
    res.status(204).send();
};

export const getAllColumns = async (req, res) => {
    const { _id: owner } = req.user;
    const baseUrl = req.baseUrl.split('/');
    const ref_board = baseUrl[3];
    const data = await columnServices.getAllColumns({ owner, ref_board });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export const getColumnById = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const data = await columnServices.getColumnByFilter({ owner, _id: id });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createColumn: ctrlWrapper(createColumn),
    updateColumn: ctrlWrapper(updateColumn),
    deleteColumnById: ctrlWrapper(deleteColumnById),
    getAllColumns: ctrlWrapper(getAllColumns),
    getColumnById: ctrlWrapper(getColumnById),
};
