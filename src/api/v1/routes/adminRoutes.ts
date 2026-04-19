import express from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { standardLimiter } from "../middleware/rateLimiter";

const router = express.Router();

/**
 * @openapi
 * /admin/setCustomClaims:
 *   post:
 *     summary: Set custom claims (role) for a user
 *     description: Assigns a role to a user. Only accessible by admins.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - role
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The Firebase UID of the user
 *                 example: "abc123def456"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, user]
 *                 description: The role to assign to the user
 *                 example: "admin"
 *     responses:
 *       '200':
 *         description: Custom claims set successfully
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
 *                   example: "Custom claims set for user: abc123def456. User must obtain a new token for changes to take effect."
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "abc123def456"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       '400':
 *         description: Bad request - Missing or invalid fields
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
 *                       example: "UID and role are required"
 *                     code:
 *                       type: string
 *                       example: "MISSING_FIELDS"
 *                 timestamp:
 *                   type: string
 *       '401':
 *         description: Unauthorized - No token provided or invalid token
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
 *         description: Forbidden - User does not have admin role
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
router.post(
    "/setCustomClaims",
    standardLimiter,
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;