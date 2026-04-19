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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Players retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Player retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *       '404':
 *         description: Player not found
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
 *                       example: "Player not found"
 *                     code:
 *                       type: string
 *                       example: "PLAYER_NOT_FOUND"
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Player created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Player'
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
 *                   example: "Player updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Player'
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
 *         description: Player not found
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
 *                       example: "Player not found"
 *                     code:
 *                       type: string
 *                       example: "PLAYER_NOT_FOUND"
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
 *                   example: "Player deleted successfully"
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
 *         description: Player not found
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
 *                       example: "Player not found"
 *                     code:
 *                       type: string
 *                       example: "PLAYER_NOT_FOUND"
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
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: playerIdParamSchema }), playerController.deletePlayer);

export default router;