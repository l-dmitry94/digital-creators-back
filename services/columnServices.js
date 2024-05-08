import Column from '../models/Column.js';

export const findColumn = filter => Column.findOne(filter);

export const addColumn = data => Column.create(data);

export const updateColumnByFilter = (filter, data) => Column.findOneAndUpdate(filter, data);

export default {
    findColumn,
    addColumn,
    updateColumnByFilter,
};
