import Column from '../models/Column.js';

export const addColumn = data => Column.create(data);

export default {
    addColumn,
};
