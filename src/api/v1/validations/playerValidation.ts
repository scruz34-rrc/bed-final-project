import Joi from "joi";

export const createPlayerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    position: Joi.string().required(),
    teamId: Joi.string().required(),
    debutYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
    isActive: Joi.boolean().default(true),
});

export const updatePlayerSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    position: Joi.string().optional(),
    teamId: Joi.string().optional(),
    debutYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    isActive: Joi.boolean().optional(),
});

export const playerIdParamSchema = Joi.object({
    id: Joi.string().required(),
});