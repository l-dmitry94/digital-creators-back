import Joi from 'joi';

export const boardCreateSchema = Joi.object({
    board_name: Joi.string().required(),
    icon: Joi.string().required(),
    background: Joi.string().required(),
});

export const boardUpdateSchema = Joi.object({
    board_name: Joi.string(),
    icon: Joi.string(),
    background: Joi.string(),
});
