import { Router } from "express";
import * as teamController from "../controllers/teamController";
import { validateRequest } from "../middleware/validate";
import { createTeamSchema, updateTeamSchema, teamIdParamSchema } from "../validations/teamValidation";

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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *                 message:
 *                   type: string
 */
router.get("/", teamController.getAllTeams);

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
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Team not found
 */
router.get("/:id", validateRequest({ params: teamIdParamSchema }), teamController.getTeamById);

/**
 * @openapi
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
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
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *                 message:
 *                   type: string
 *       '400':
 *         description: Invalid input data
 */
router.post("/", validateRequest({ body: createTeamSchema }), teamController.createTeam);

/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     summary: Update an existing team
 *     tags: [Teams]
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
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *                 message:
 *                   type: string
 *       '404':
 *         description: Team not found
 *       '400':
 *         description: Invalid input data
 */
router.put("/:id", validateRequest({ params: teamIdParamSchema, body: updateTeamSchema }), teamController.updateTeam);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team
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
 *         description: Team deleted successfully
 *       '404':
 *         description: Team not found
 */
router.delete("/:id", validateRequest({ params: teamIdParamSchema }), teamController.deleteTeam);

export default router;