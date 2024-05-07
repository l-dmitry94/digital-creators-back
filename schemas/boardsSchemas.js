import Joi from 'joi';

export const boardCreateSchema = Joi.object({
    board_name: Joi.string().required(),
    icon: Joi.string(),
    background: Joi.object({
        desktop_url: Joi.string(),
        tablet_url: Joi.string(),
        mobile_url: Joi.string(),
    }),
});

export const boardUpdateSchema = Joi.object({
    board_name: Joi.string(),
    icon: Joi.string(),
    background: Joi.object({
        desktop_url: Joi.string(),
        tablet_url: Joi.string(),
        mobile_url: Joi.string(),
    }),
});
