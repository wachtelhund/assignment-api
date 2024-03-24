import express from 'express';
import { router as hivesRouter } from './hives/hivesRouter';
import { router as authRouter } from './auth/authRouter';

export const router = express.Router();

router.get('/', (req, res, next) =>  {
    res.json({
        message: 'Welcome to the hive api, v1',
        _links: {
            docs: '/api/v1/docs',
            authentication: {
                login: '/api/v1/login',
                register: '/api/v1/register',
                logout: '/api/v1/logout'
            },
            hives: '/api/v1/hives'
        }

    })

});

router.use('/hives', hivesRouter);
router.use('/auth', authRouter);
