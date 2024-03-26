import express from 'express';
import { router as hivesRouter } from './hives/hivesRouter';
import { router as authRouter } from './auth/authRouter';

export const router = express.Router();

router.get('/', (req, res, next) =>  {
    res.json({
        message: 'Welcome to the hive api, v1',
        _links: {
            docs: {
                href: '/api/v1/docs',
                method: 'GET',
                title: 'API documentation'
            },
            authentication: {
                login: {
                    href: '/api/v1/auth/login',
                    method: 'POST',
                    title: 'Login'
                },
                register: {
                    href: '/api/v1/auth/register',
                    method: 'POST',
                    title: 'Register'
                },
                logout: {
                    href: '/api/v1/auth/logout',
                    method: 'POST',
                    title: 'Logout'
                }
            },
            hives: {
                href: '/api/v1/hives',
                method: 'GET',
                title: 'Get hives'
            }
        }

    })
});

router.use('/hives', hivesRouter);
router.use('/auth', authRouter);
