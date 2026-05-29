import { Router } from "express";
import { addCharacter } from "../controllers/characterController.js";

const router = Router();

router.post('/', addCharacter);

export default router;
