import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - city
 *         - league
 *         - foundedYear
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a team
 *           example: "team_abc123"
 *         name:
 *           type: string
 *           description: The team name
 *           example: "Yankees"
 *         city:
 *           type: string
 *           description: The city where the team is located
 *           example: "New York"
 *         league:
 *           type: string
 *           enum: [AL, NL]
 *           description: The league (AL = American League, NL = National League)
 *           example: "AL"
 *         foundedYear:
 *           type: number
 *           description: The year the team was founded
 *           example: 1901
 *         isActive:
 *           type: boolean
 *           description: Whether the team is currently active
 *           example: true
 *     TeamInput:
 *       type: object
 *       required:
 *         - name
 *         - city
 *         - league
 *         - foundedYear
 *       properties:
 *         name:
 *           type: string
 *           example: "Yankees"
 *         city:
 *           type: string
 *           example: "New York"
 *         league:
 *           type: string
 *           enum: [AL, NL]
 *           example: "AL"
 *         foundedYear:
 *           type: number
 *           example: 1901
 *         isActive:
 *           type: boolean
 *           default: true
 *     TeamUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         city:
 *           type: string
 *         league:
 *           type: string
 *           enum: [AL, NL]
 *         foundedYear:
 *           type: number
 *         isActive:
 *           type: boolean
 */
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