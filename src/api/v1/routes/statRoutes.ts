import { Router } from "express";
import * as statController from "../controllers/statController";
import { validateRequest } from "../middleware/validate";
import { createStatSchema, updateStatSchema, statIdParamSchema, playerStatsParamSchema } from "../validations/statValidation";
import { standardLimiter } from "../middleware/rateLimiter";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /stats/player/{playerId}:
 *   get:
 *     summary: Get all stat lines for a specific player
 *     tags: [Stats]
 *     parameters:
 *       - name: playerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved player stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Stats retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StatLine'
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Too many requests, please try again later."
 *                     code:
 *                       type: string
 *                       example: "RATE_LIMIT_EXCEEDED"
 *                 timestamp:
 *                   type: string
 */
router.get("/player/:playerId", standardLimiter, validateRequest({ params: playerStatsParamSchema }), statController.getStatsByPlayer);

/**
 * @openapi
 * /stats/{id}:
 *   get:
 *     summary: Get a specific stat line by ID
 *     tags: [Stats]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The stat line ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved stat line
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Stat line retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *       '404':
 *         description: Stat line not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Stat line not found"
 *                     code:
 *                       type: string
 *                       example: "STAT_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Too many requests, please try again later."
 *                     code:
 *                       type: string
 *                       example: "RATE_LIMIT_EXCEEDED"
 *                 timestamp:
 *                   type: string
 */
router.get("/:id", standardLimiter, validateRequest({ params: statIdParamSchema }), statController.getStatById);

/**
 * @openapi
 * /stats/player/{playerId}:
 *   post:
 *     summary: Create a new stat line for a player
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: playerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatLineInput'
 *     responses:
 *       '201':
 *         description: Stat line created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Stat line created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                 timestamp:
 *                   type: string
 *       '401':
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized: No token provided"
 *                     code:
 *                       type: string
 *                       example: "TOKEN_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '403':
 *         description: Forbidden - Insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Forbidden: Insufficient role"
 *                     code:
 *                       type: string
 *                       example: "INSUFFICIENT_ROLE"
 *                 timestamp:
 *                   type: string
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Too many requests, please try again later."
 *                     code:
 *                       type: string
 *                       example: "RATE_LIMIT_EXCEEDED"
 *                 timestamp:
 *                   type: string
 */
router.post("/player/:playerId", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ params: playerStatsParamSchema, body: createStatSchema }), statController.createStat);

/**
 * @openapi
 * /stats/{id}:
 *   put:
 *     summary: Update an existing stat line
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The stat line ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatLineUpdate'
 *     responses:
 *       '200':
 *         description: Stat line updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Stat line updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                 timestamp:
 *                   type: string
 *       '401':
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized: No token provided"
 *                     code:
 *                       type: string
 *                       example: "TOKEN_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '403':
 *         description: Forbidden - Insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Forbidden: Insufficient role"
 *                     code:
 *                       type: string
 *                       example: "INSUFFICIENT_ROLE"
 *                 timestamp:
 *                   type: string
 *       '404':
 *         description: Stat line not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Stat line not found"
 *                     code:
 *                       type: string
 *                       example: "STAT_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Too many requests, please try again later."
 *                     code:
 *                       type: string
 *                       example: "RATE_LIMIT_EXCEEDED"
 *                 timestamp:
 *                   type: string
 */
router.put("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ params: statIdParamSchema, body: updateStatSchema }), statController.updateStat);

/**
 * @openapi
 * /stats/{id}:
 *   delete:
 *     summary: Delete a stat line
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The stat line ID
 *     responses:
 *       '200':
 *         description: Stat line deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Stat line deleted successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       '401':
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unauthorized: No token provided"
 *                     code:
 *                       type: string
 *                       example: "TOKEN_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '403':
 *         description: Forbidden - Insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Forbidden: Insufficient role"
 *                     code:
 *                       type: string
 *                       example: "INSUFFICIENT_ROLE"
 *                 timestamp:
 *                   type: string
 *       '404':
 *         description: Stat line not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Stat line not found"
 *                     code:
 *                       type: string
 *                       example: "STAT_NOT_FOUND"
 *                 timestamp:
 *                   type: string
 *       '429':
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Too many requests, please try again later."
 *                     code:
 *                       type: string
 *                       example: "RATE_LIMIT_EXCEEDED"
 *                 timestamp:
 *                   type: string
 */
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: statIdParamSchema }), statController.deleteStat);

export default router;