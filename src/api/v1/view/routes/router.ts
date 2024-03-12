import express from 'express';
import { router as hivesRouter } from './hives/hivesRouter';

export const router = express.Router();

router.use('/hives', hivesRouter);