import Card from '../models/Card.js';

export const addCard = data => Card.create(data);

export const updateCardByFilter = (filter, data) => Card.findOneAndUpdate(filter, data);

export const getCardByFilter = filter => Card.findOne(filter);

export default {
    addCard,
    updateCardByFilter,
    getCardByFilter,
};
