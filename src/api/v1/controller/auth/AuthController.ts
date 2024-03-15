import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/mongoose/schemas/user.model";
import { generateJWT } from "../../../../utils/tokenHandlers";
import { RequestError } from "../../../../utils/requestError";
import { User } from "../../model/types/User";

export class AuthController {
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({ message: 'Missing parameters' });
            }

            const user = await UserModel.findOne({ username: username });
            
            if (user) {
                res.status(400).json({ message: 'User already exists' });
            }

            const newUser = new UserModel({
                username,
                password
            })

            const createdUser = await newUser.save();

            if (createdUser) {
                res.status(201).json({
                    message: 'User created',
                    _links: {
                        docs: '/api/v1/docs',
                        login: '/api/v1/auth/login',
                        logout: '/api/v1/auth/logout'
                    }
                });
            }
        } catch (error) {
            next(new RequestError('Error creating user', 500));
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({ message: 'Missing parameters' });
            }
            const user = await UserModel.findOne({ username: username });

            if (user && (await user.comparePassword(password))) {
                const token = generateJWT(res, user.id);
                user.lastJWT = token;
                await user.save();
                res.status(200).json({
                    message: 'Logged in successfully',
                    token: token,
                    _links: {
                        docs: '/api/v1/docs',
                        logout: '/api/v1/auth/logout'
                    }
                });
            } else {
                next(new RequestError('Invalid credentials', 401));
            }
        } catch (error) {
            next(new RequestError('Error logging in', 500));
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token) {
                const updatedUser = await UserModel.findOneAndUpdate({ lastJWT: token }, { lastJWT: ''})
                if (updatedUser) {
                    res.status(200).json({
                        message: 'Logged out successfully',
                        _links: {
                            docs: '/api/v1/docs',
                            login: '/api/v1/auth/login'
                        }
                    });
                } else {
                    next(new RequestError('Please use a valid token to logout', 400));
                }
            }
        } catch (error) {
            next(new RequestError('Error logging out', 500));
        }
    }
}