import { Router } from "express";
import * as playerController from "../controllers/playerController";
import { validateRequest } from "../middleware/validate";
import { createPlayerSchema, updatePlayerSchema, playerIdParamSchema } from "../validations/playerValidation";

const router = Router();

router.get("/", playerController.getAllPlayers);
router.get("/:id", validateRequest({ params: playerIdParamSchema }), playerController.getPlayerById);
router.post("/", validateRequest({ body: createPlayerSchema }), playerController.createPlayer);
router.put("/:id", validateRequest({ params: playerIdParamSchema, body: updatePlayerSchema }), playerController.updatePlayer);
router.delete("/:id", validateRequest({ params: playerIdParamSchema }), playerController.deletePlayer);

export default router;