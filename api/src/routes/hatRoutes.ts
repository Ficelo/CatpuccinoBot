import { Router } from "express";
import { addHat } from "../controllers/hatController.js";

const router = Router();

router.post('/', addHat);

export default router;
