import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import columnServices from '../services/columnServices.js';

export const createColumn = async (req, res) => {
    const { _id: owner } = req.user;
    const { boardId: ref_board } = req.params;
    // const ObjectId = mongoose.Types.ObjectId;
    // const ref_board = ObjectId(boardId)
    const data = await columnServices.addColumn({ ...req.body, ref_board, owner });
    res.status(201).json(data);
};

export default {
    createColumn: ctrlWrapper(createColumn),
};
