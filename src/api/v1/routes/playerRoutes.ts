import { Router } from "express";
import * as playerController from "../controllers/playerController";
import { validateRequest } from "../middleware/validate";
import { createPlayerSchema, updatePlayerSchema, playerIdParamSchema } from "../validations/playerValidation";
import { standardLimiter } from "../middleware/rateLimiter";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

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
 *       '429':
 *         description: Rate limit exceeded
 */
router.get("/", standardLimiter, playerController.getAllPlayers);

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
 *       '429':
 *         description: Rate limit exceeded
 */
router.get("/:id", standardLimiter, validateRequest({ params: playerIdParamSchema }), playerController.getPlayerById);

/**
 * @openapi
 * /players:
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
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
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 */
router.post("/", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ body: createPlayerSchema }), playerController.createPlayer);

/**
 * @openapi
 * /players/{id}:
 *   put:
 *     summary: Update an existing player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
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
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Player not found
 */
router.put("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ params: playerIdParamSchema, body: updatePlayerSchema }), playerController.updatePlayer);

/**
 * @openapi
 * /players/{id}:
 *   delete:
 *     summary: Delete a player
 *     tags: [Players]
 *     security:
 *       - bearerAuth: []
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
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Player not found
 */
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: playerIdParamSchema }), playerController.deletePlayer);

export default router;