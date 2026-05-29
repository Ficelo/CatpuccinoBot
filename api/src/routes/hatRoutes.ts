import { Router } from "express";
import { addHat, addHatWithDisocrdAvatar } from "../controllers/hatController.js";

const router = Router();

router.post('/', addHat);
router.post('/discord', addHatWithDisocrdAvatar);

export default router;
