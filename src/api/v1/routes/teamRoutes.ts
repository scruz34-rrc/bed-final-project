import { Router } from "express";
import * as teamController from "../controllers/teamController";
import { validateRequest } from "../middleware/validate";
import { createTeamSchema, updateTeamSchema, teamIdParamSchema } from "../validations/teamValidation";

const router = Router();

router.get("/", teamController.getAllTeams);
router.get("/:id", validateRequest({ params: teamIdParamSchema }), teamController.getTeamById);
router.post("/", validateRequest({ body: createTeamSchema }), teamController.createTeam);
router.put("/:id", validateRequest({ params: teamIdParamSchema, body: updateTeamSchema }), teamController.updateTeam);
router.delete("/:id", validateRequest({ params: teamIdParamSchema }), teamController.deleteTeam);

export default router;