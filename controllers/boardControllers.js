import { addBoard } from "../services/boardServices.js";


export const getAllBoards = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, favorite } = req.query;
      const { _id: owner } = req.user;
      const skip = (page - 1) * limit;
      const filter = favorite !== undefined ? { owner, favorite } : { owner };
      // const filter = Object.assign(
      //   { owner },
      //   favorite !== undefined && { favorite }
      // );
      const data = await contactsService.listContacts(filter, { skip, limit });
      const total = await contactsService.countContacts({ owner });
      const perpage = data.length;
      res.json({ data, total, perpage });
    } catch (error) {
      next(error);
    }
  };
export const createBoard = async (req, res, next) => {
    try {
      const { _id: owner } = req.user;
      const data = await addBoard({ ...req.body, owner });
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };
  export const deleteBoardById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { _id: owner } = req.user;
      const data = await contactsService.removeContact({ owner, id });
      if (!data) throw HttpError(404);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };