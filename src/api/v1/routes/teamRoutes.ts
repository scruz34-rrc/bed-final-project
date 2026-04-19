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
 *       '429':
 *         description: Rate limit exceeded
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
 *       '404':
 *         description: Team not found
 *       '429':
 *         description: Rate limit exceeded
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
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
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
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Team not found
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
 *       '401':
 *         description: Unauthorized - No token provided
 *       '403':
 *         description: Forbidden - Insufficient role
 *       '404':
 *         description: Team not found
 */
router.delete("/:id", standardLimiter, authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest({ params: teamIdParamSchema }), teamController.deleteTeam);

export default router;