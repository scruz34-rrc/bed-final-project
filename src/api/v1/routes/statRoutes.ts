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
 *       '429':
 *         description: Rate limit exceeded
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
 *       '404':
 *         description: Stat line not found
 *       '429':
 *         description: Rate limit exceeded
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
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
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
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Stat line not found
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
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Stat line not found
 */
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: statIdParamSchema }), statController.deleteStat);

export default router;