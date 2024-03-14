import express from 'express';
import { router as hivesRouter } from './hives/hivesRouter';
import { router as authRouter } from './auth/authRouter';

export const router = express.Router();

router.use('/hives', hivesRouter);
router.use('/auth', authRouter);
