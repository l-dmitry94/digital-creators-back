import Joi from 'joi';

export const cardCreateSchema = Joi.object({
    card_name: Joi.string().required(),
    description: Joi.string(),
    priority: Joi.string().required(),
    deadline: Joi.string().required(),
});

export const cardUpdateSchema = Joi.object({
    card_name: Joi.string(),
    description: Joi.string(),
    priority: Joi.string(),
    deadline: Joi.string(),
});
export const cardColumUpdateSchema = Joi.object({
    card_id: Joi.string(),
    newColumn: Joi.string()
})
