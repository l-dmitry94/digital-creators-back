import { addBoard } from '../services/boardServices.js';

export const getAllBoards = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
};
