import Joi from 'joi';

export const columnCreateUpdateSchema = Joi.object({
    column_name: Joi.string().required(),
});
