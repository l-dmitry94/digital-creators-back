import Column from '../models/Column.js';

export const findColumn = filter => Column.findOne(filter);

export const addColumn = data => Column.create(data);

export const updateColumnByFilter = (filter, data) => Column.findOneAndUpdate(filter, data);

export const removeColumnByFilter = filter => Column.findOneAndDelete(filter);

export const getColumnByFilter = filter => Column.findOne(filter);

export default {
    findColumn,
    addColumn,
    updateColumnByFilter,
    removeColumnByFilter,
    getColumnByFilter,
};
