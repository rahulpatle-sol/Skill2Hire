import { Router } from "express";
import { getMyTeam, verifyTalent } from "../controllers/manager.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Saare routes protected rahenge
router.use(verifyJWT); 

// URL: /api/v1/manager/bridge
router.route("/bridge").get(getMyTeam);

// URL: /api/v1/manager/verify-talent
router.route("/verify-talent").post(verifyTalent);

export default router;