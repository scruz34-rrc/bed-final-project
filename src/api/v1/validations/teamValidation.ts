import Joi from "joi";

export const createTeamSchema = Joi.object({
    name: Joi.string().required(),
    city: Joi.string().required(),
    league: Joi.string().required(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
    isActive: Joi.boolean().default(true),
});

export const updateTeamSchema = Joi.object({
    name: Joi.string().optional(),
    city: Joi.string().optional(),
    league: Joi.string().optional(),
    foundedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    isActive: Joi.boolean().optional(),
});

export const teamIdParamSchema = Joi.object({
    id: Joi.string().required(),
});