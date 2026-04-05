import Joi from "joi";

export const createStatSchema = Joi.object({
    season: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
    teamId: Joi.string().required(),
    gamesPlayed: Joi.number().integer().min(0).default(0),
    atBats: Joi.number().integer().min(0).default(0),
    hits: Joi.number().integer().min(0).default(0),
    walks: Joi.number().integer().min(0).default(0),
    homeRuns: Joi.number().integer().min(0).default(0),
    runsBattedIn: Joi.number().integer().min(0).default(0),
    battingAverage: Joi.number().min(0).max(1).default(0),
});

export const updateStatSchema = Joi.object({
    season: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    teamId: Joi.string().optional(),
    gamesPlayed: Joi.number().integer().min(0).optional(),
    atBats: Joi.number().integer().min(0).optional(),
    hits: Joi.number().integer().min(0).optional(),
    walks: Joi.number().integer().min(0).optional(),
    homeRuns: Joi.number().integer().min(0).optional(),
    runsBattedIn: Joi.number().integer().min(0).optional(),
    battingAverage: Joi.number().min(0).max(1).optional(),
});

export const statIdParamSchema = Joi.object({
    id: Joi.string().required(),
});

export const playerStatsParamSchema = Joi.object({
    playerId: Joi.string().required(),
});