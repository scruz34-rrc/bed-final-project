import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - position
 *         - teamId
 *         - debutYear
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a player
 *           example: "player_abc123"
 *         firstName:
 *           type: string
 *           description: The player's first name
 *           example: "Aaron"
 *         lastName:
 *           type: string
 *           description: The player's last name
 *           example: "Judge"
 *         position:
 *           type: string
 *           description: The player's position
 *           example: "RF"
 *         teamId:
 *           type: string
 *           description: The ID of the team the player belongs to
 *           example: "team_abc123"
 *         debutYear:
 *           type: number
 *           description: The year the player made their debut
 *           example: 2016
 *         isActive:
 *           type: boolean
 *           description: Whether the player is currently active
 *           example: true
 *     PlayerInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - position
 *         - teamId
 *         - debutYear
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Aaron"
 *         lastName:
 *           type: string
 *           example: "Judge"
 *         position:
 *           type: string
 *           example: "RF"
 *         teamId:
 *           type: string
 *           example: "team_abc123"
 *         debutYear:
 *           type: number
 *           example: 2016
 *         isActive:
 *           type: boolean
 *           default: true
 *     PlayerUpdate:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         position:
 *           type: string
 *         teamId:
 *           type: string
 *         debutYear:
 *           type: number
 *         isActive:
 *           type: boolean
 */
export const createPlayerSchema = Joi.object({
    id: Joi.string().optional(),
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