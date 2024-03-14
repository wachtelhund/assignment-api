import { NextFunction, Request, Response } from "express";
import UserModel from "../../model/mongoose/schemas/user.model";
import { clearJWT, generateJWT } from "../../../../utils/tokenHandlers";
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
                generateJWT(res, createdUser.id);
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
            const user = await UserModel.findOne<User>({ username: username });

            if (user && (await user.comparePassword(password))) {
                generateJWT(res, user.id);
                res.status(200).json({
                    message: 'Logged in successfully',
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
        clearJWT(res);
        res.status(200).json({
            message: 'Logged out successfully',
            _links: {
                docs: '/api/v1/docs',
                login: '/api/v1/auth/login'
            }
        });
    }
}