import Joi from 'joi';

export const boardCreateSchema = Joi.object({
    board_name: Joi.string().required(),
    icon: Joi.string().allow(null).optional().default(null),
    background: Joi.string().allow(null).optional().default(null),
});

export const boardUpdateSchema = Joi.object({
    board_name: Joi.string().optional(),
    icon: Joi.string().allow(null).optional(),
    background: Joi.string().allow(null).optional(),
});
