import { Router } from "express";
import { addQuote } from "../controllers/quotesController";

const router = Router();

router.post('/', addQuote);

export default router;
