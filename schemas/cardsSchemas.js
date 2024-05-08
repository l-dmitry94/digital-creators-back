import Joi from 'joi';

export const cardCreateSchema = Joi.object({
    card_name: Joi.string().required(),
    description: Joi.string(),
    priority: Joi.string().required(),
    deadline: Joi.string().required(),
});
