import { Router } from "express";
import * as playerController from "../controllers/playerController";
import { validateRequest } from "../middleware/validate";
import { createPlayerSchema, updatePlayerSchema, playerIdParamSchema } from "../validations/playerValidation";

const router = Router();

/**
 * @openapi
 * /players:
 *   get:
 *     summary: Retrieve a list of all players
 *     tags: [Players]
 *     parameters:
 *       - name: teamId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter players by team ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved players
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
 *                     $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 */
router.get("/", playerController.getAllPlayers);

/**
 * @openapi
 * /players/{id}:
 *   get:
 *     summary: Get a single player by ID
 *     tags: [Players]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved player
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Player not found
 */
router.get("/:id", validateRequest({ params: playerIdParamSchema }), playerController.getPlayerById);

/**
 * @openapi
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlayerInput'
 *     responses:
 *       '201':
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid input data
 */
router.post("/", validateRequest({ body: createPlayerSchema }), playerController.createPlayer);

/**
 * @openapi
 * /players/{id}:
 *   put:
 *     summary: Update an existing player
 *     tags: [Players]
 *     parameters:
 *       - name: id
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
 *             $ref: '#/components/schemas/PlayerUpdate'
 *     responses:
 *       '200':
 *         description: Player updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Player not found
 *       '400':
 *         description: Invalid input data
 */
router.put("/:id", validateRequest({ params: playerIdParamSchema, body: updatePlayerSchema }), playerController.updatePlayer);

/**
 * @openapi
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The player ID
 *     responses:
 *       '200':
 *         description: Player deleted successfully
 *       '404':
 *         description: Player not found
 */
router.delete("/:id", validateRequest({ params: playerIdParamSchema }), playerController.deletePlayer);

export default router;