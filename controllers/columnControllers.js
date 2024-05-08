import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import columnServices from '../services/columnServices.js';

export const createColumn = async (req, res) => {
    const { _id: owner } = req.user;
    console.log(req.baseUrl);
    const baseUrl = req.baseUrl;
    const ref_board = baseUrl.split('/')[3];
    console.log(ref_board);
    console.log(owner);
    console.log(ref_board);
    // const ObjectId = mongoose.Types.ObjectId;
    // const ref_board = ObjectId(boardId)
    const data = await columnServices.addColumn({ ...req.body, ref_board, owner });
    res.status(201).json(data);
};

export default {
    createColumn: ctrlWrapper(createColumn),
};
