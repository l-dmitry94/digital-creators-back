import Column from '../models/Column.js';

export const addColumn = data => Column.create(data);

export const updateColumnByFilter = (filter, data) => Column.findOneAndUpdate(filter, data);

export const removeColumnByFilter = filter => Column.findOneAndDelete(filter);

export const getAllColumns = filter => Column.find(filter);

export const getColumnByFilter = filter => Column.findOne(filter);

export default {
    addColumn,
    updateColumnByFilter,
    removeColumnByFilter,
    getAllColumns,
    getColumnByFilter,
};
