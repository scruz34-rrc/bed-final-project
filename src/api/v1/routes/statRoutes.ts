import { Router } from "express";
import * as statController from "../controllers/statController";
import { validateRequest } from "../middleware/validate";
import { createStatSchema, updateStatSchema, statIdParamSchema, playerStatsParamSchema } from "../validations/statValidation";

const router = Router();

router.get("/player/:playerId", validateRequest({ params: playerStatsParamSchema }), statController.getStatsByPlayer);
router.get("/:id", validateRequest({ params: statIdParamSchema }), statController.getStatById);
router.post("/player/:playerId", validateRequest({ params: playerStatsParamSchema, body: createStatSchema }), statController.createStat);
router.put("/:id", validateRequest({ params: statIdParamSchema, body: updateStatSchema }), statController.updateStat);
router.delete("/:id", validateRequest({ params: statIdParamSchema }), statController.deleteStat);

export default router;