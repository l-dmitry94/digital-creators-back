import Card from '../models/Card.js';

export const addCard = data => Card.create(data);

export default {
    addCard,
};
