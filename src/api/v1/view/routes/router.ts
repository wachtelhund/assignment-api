import express from 'express';
import { router as hivesRouter } from './hives/hivesRouter';

export const router = express.Router();

router.use('/docs', (req, res) => {
    res.send('Documentation');
});

router.use('/hives', hivesRouter);