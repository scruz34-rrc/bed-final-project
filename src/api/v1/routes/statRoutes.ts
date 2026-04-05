import { Router } from "express";
import * as statController from "../controllers/statController";
import { validateRequest } from "../middleware/validate";
import { createStatSchema, updateStatSchema, statIdParamSchema, playerStatsParamSchema } from "../validations/statValidation";

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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StatLine'
 *                 message:
 *                   type: string
 */
router.get("/player/:playerId", validateRequest({ params: playerStatsParamSchema }), statController.getStatsByPlayer);

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
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Stat line not found
 */
router.get("/:id", validateRequest({ params: statIdParamSchema }), statController.getStatById);

/**
 * @openapi
 * /stats/player/{playerId}:
 *   post:
 *     summary: Create a new stat line for a player
 *     tags: [Stats]
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
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid input data
 */
router.post("/player/:playerId", validateRequest({ params: playerStatsParamSchema, body: createStatSchema }), statController.createStat);

/**
 * @openapi
 * /stats/{id}:
 *   put:
 *     summary: Update an existing stat line
 *     tags: [Stats]
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
 *                 data:
 *                   $ref: '#/components/schemas/StatLine'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Stat line not found
 *       '400':
 *         description: Invalid input data
 */
router.put("/:id", validateRequest({ params: statIdParamSchema, body: updateStatSchema }), statController.updateStat);

/**
 * @openapi
 * /stats/{id}:
 *   delete:
 *     summary: Delete a stat line
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
 *         description: Stat line deleted successfully
 *       '404':
 *         description: Stat line not found
 */
router.delete("/:id", validateRequest({ params: statIdParamSchema }), statController.deleteStat);

export default router;