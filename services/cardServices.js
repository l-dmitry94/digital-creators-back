import Card from '../models/Card.js';

export const addCard = data => Card.create(data);

export const updateCardByFilter = (filter, data) => Card.findOneAndUpdate(filter, data);

export const removeCardByFilter = filter => Card.findOneAndDelete(filter);

export const removeAllCardsInBoards = filter => Card.deleteMany(filter);

export const getAllCards = filter => Card.find(filter);

export const getCardByFilter = filter => Card.findOne(filter);

export default {
    addCard,
    updateCardByFilter,
    removeCardByFilter,
    getCardByFilter,
    getAllCards,
};
