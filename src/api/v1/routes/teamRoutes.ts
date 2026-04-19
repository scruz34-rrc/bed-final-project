import { Router } from "express";
import * as teamController from "../controllers/teamController";
import { validateRequest } from "../middleware/validate";
import { createTeamSchema, updateTeamSchema, teamIdParamSchema } from "../validations/teamValidation";
import { standardLimiter } from "../middleware/rateLimiter";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router = Router();

/**
 * @openapi
 * /teams:
 *   get:
 *     summary: Retrieve a list of all teams
 *     tags: [Teams]
 *     responses:
 *       '200':
 *         description: Successfully retrieved teams
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
 *                   example: "Teams retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
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
router.get("/", standardLimiter, teamController.getAllTeams);

/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     summary: Get a single team by ID
 *     tags: [Teams]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     responses:
 *       '200':
 *         description: Successfully retrieved team
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
 *                   example: "Team retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       '404':
 *         description: Team not found
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
 *                       example: "Team not found"
 *                     code:
 *                       type: string
 *                       example: "TEAM_NOT_FOUND"
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
router.get("/:id", standardLimiter, validateRequest({ params: teamIdParamSchema }), teamController.getTeamById);

/**
 * @openapi
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInput'
 *     responses:
 *       '201':
 *         description: Team created successfully
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
 *                   example: "Team created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Team'
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
router.post("/", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ body: createTeamSchema }), teamController.createTeam);

/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     summary: Update an existing team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamUpdate'
 *     responses:
 *       '200':
 *         description: Team updated successfully
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
 *                   example: "Team updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Team'
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
 *         description: Team not found
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
 *                       example: "Team not found"
 *                     code:
 *                       type: string
 *                       example: "TEAM_NOT_FOUND"
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
router.put("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), validateRequest({ params: teamIdParamSchema, body: updateTeamSchema }), teamController.updateTeam);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     responses:
 *       '200':
 *         description: Team deleted successfully
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
 *                   example: "Team deleted successfully"
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
 *         description: Team not found
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
 *                       example: "Team not found"
 *                     code:
 *                       type: string
 *                       example: "TEAM_NOT_FOUND"
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
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: teamIdParamSchema }), teamController.deleteTeam);

export default router;