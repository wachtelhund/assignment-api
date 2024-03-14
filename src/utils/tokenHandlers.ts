import e, { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function generateJWT(res: Response, userId: string) {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const jwtToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '4h' });
    res.status(200).json({
        token: jwtToken,
        _links: {
            docs: '/api/v1/docs',
            logout: '/api/v1/auth/logout',
            hives: '/api/v1/hives'
        }
    });
}

export function clearJWT(res: Response) {
    res.clearCookie('assignment-api-token');
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const unauthorized = {
        message: 'Unauthorized',
        _links: {
            login: '/api/v1/auth/login',
            register: '/api/v1/auth/register'
        }
    }
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json(unauthorized);
        } else {
            const jwtSecret = process.env.JWT_SECRET || 'secret';
            const decoded = jwt.verify(token, jwtSecret);

            if (decoded) {
                next();
            } else {
                res.status(401).json(unauthorized);
            }
        }
    } catch (error) {
        res.status(401).json(unauthorized);
    }
}