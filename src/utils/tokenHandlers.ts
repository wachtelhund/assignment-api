import e, { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../api/v1/model/mongoose/schemas/user.model';
import { RequestError } from './requestError';

export function generateJWT(res: Response, userId: string) {
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const jwtToken = jwt.sign({ userId }, jwtSecret, { expiresIn: '4h' });
    return jwtToken;
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const unauthorized = {
        message: 'Unauthorized',
        _links: {
            login: {
                href: '/api/v1/auth/login',
                method: 'POST',
                title: 'Login',
            },
            register: {
                href: '/api/v1/auth/register',
                method: 'POST',
                title: 'Register',
            }
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
                const userId = (decoded as JwtPayload).userId;
                const user = await UserModel.findById(userId);
                
                if (!user || user.lastJWT !== token) {
                    next(new RequestError('Unauthorized, token has been revoked, please sign in again and use the new token', 401))
                }
                next();
            } else {
                res.status(401).json(unauthorized);
            }
        }
    } catch (error) {
        res.status(401).json(unauthorized);
    }
}