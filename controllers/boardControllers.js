import boardServices from '../services/boardServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

// export const getAllBoards = async (req, res, next) => {
//     try {
//       const { page = 1, limit = 10, favorite } = req.query;
//       const { _id: owner } = req.user;
//       const skip = (page - 1) * limit;
//       const filter = favorite !== undefined ? { owner, favorite } : { owner };
//       // const filter = Object.assign(
//       //   { owner },
//       //   favorite !== undefined && { favorite }
//       // );
//       const data = await contactsService.listContacts(filter, { skip, limit });
//       const total = await contactsService.countContacts({ owner });
//       const perpage = data.length;
//       res.json({ data, total, perpage });
//     } catch (error) {
//       next(error);
//     }
// };

export const createBoard = async (req, res) => {
    const { _id: owner } = req.user;
    const data = await boardServices.addBoard({ ...req.body, owner });
    res.status(201).json(data);
};

export const deleteBoardById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { _id: owner } = req.user;
    console.log(owner);
    const data = await boardServices.removeBoardByFilter({ owner, id });
    if (!data) throw HttpError(404, 'Not found');
    res.json(data);
};

export default {
    createBoard: ctrlWrapper(createBoard),
    deleteBoardById: ctrlWrapper(deleteBoardById),
};
