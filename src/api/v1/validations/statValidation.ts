import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     StatLine:
 *       type: object
 *       required:
 *         - id
 *         - playerId
 *         - season
 *         - teamId
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the stat line
 *         playerId:
 *           type: string
 *           description: The ID of the player
 *         season:
 *           type: number
 *           description: The season year
 *           example: 2023
 *         teamId:
 *           type: string
 *           description: The ID of the team the player played for that season
 *         gamesPlayed:
 *           type: number
 *           description: Number of games played
 *           default: 0
 *         atBats:
 *           type: number
 *           description: Number of at-bats
 *           default: 0
 *         hits:
 *           type: number
 *           description: Number of hits
 *           default: 0
 *         walks:
 *           type: number
 *           description: Number of walks
 *           default: 0
 *         homeRuns:
 *           type: number
 *           description: Number of home runs
 *           default: 0
 *         runsBattedIn:
 *           type: number
 *           description: Number of RBIs
 *           default: 0
 *         battingAverage:
 *           type: number
 *           description: Batting average (hits / atBats)
 *           default: 0
 *     StatLineInput:
 *       type: object
 *       required:
 *         - season
 *         - teamId
 *       properties:
 *         season:
 *           type: number
 *           example: 2023
 *         teamId:
 *           type: string
 *           example: "team_abc123"
 *         gamesPlayed:
 *           type: number
 *           default: 0
 *         atBats:
 *           type: number
 *           default: 0
 *         hits:
 *           type: number
 *           default: 0
 *         walks:
 *           type: number
 *           default: 0
 *         homeRuns:
 *           type: number
 *           default: 0
 *         runsBattedIn:
 *           type: number
 *           default: 0
 *     StatLineUpdate:
 *       type: object
 *       properties:
 *         season:
 *           type: number
 *         teamId:
 *           type: string
 *         gamesPlayed:
 *           type: number
 *         atBats:
 *           type: number
 *         hits:
 *           type: number
 *         walks:
 *           type: number
 *         homeRuns:
 *           type: number
 *         runsBattedIn:
 *           type: number
 */
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