import { Router } from 'express';
import { makePonkerShock } from '../controllers/ponkerShockController.js';

const router = Router();

router.post('/', makePonkerShock);

export default router;